
import base64
import secrets
import requests
from urllib.parse import urlencode

from flask import abort, current_app, jsonify, make_response, redirect, render_template, request, session, url_for
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt, get_jwt_identity, jwt_required, set_access_cookies, set_refresh_cookies, unset_jwt_cookies, unset_refresh_cookies

from project.users import user_service
from . import auth_blueprint

from google.oauth2 import id_token as google_id_token
from google.auth.transport import requests as google_requests

GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"


def _rand(b=32):
    return base64.urlsafe_b64encode(secrets.token_bytes(b)).rstrip(b"=").decode("ascii")

@auth_blueprint.route("/login", methods=["GET"])
@jwt_required(optional=True)
def login_page():
    current_identity = get_jwt_identity()
    if current_identity:
        return redirect('/')

    nxt = request.args.get("next", "/")
    return render_template("login.html", next=nxt)


@auth_blueprint.route("/register", methods=["GET"])
@jwt_required(optional=True)
def register_page():
    current_identity = get_jwt_identity()
    if current_identity:
        return redirect('/')

    nxt = request.args.get("next", "/")
    return render_template("register.html", next=nxt)


@auth_blueprint.route("/login", methods=["POST"])
def login():
    """
    Starts the Google OAuth2 Authorization Code flow.
    Uses only google-auth for verifying the ID token later.
    """
    # CSRF protection via state; anti-replay via nonce
    state = _rand(16)
    nonce = _rand(16)
    session["oauth_state"] = state
    session["oauth_nonce"] = nonce
    session["post_login_redirect"] = request.form.get("next") or "/"

    params = {
        "client_id": current_app.config["GOOGLE_CLIENT_ID"],
        "response_type": "code",
        "scope": "openid email profile",
        "redirect_uri": current_app.config["GOOGLE_REDIRECT_URI"],
        "state": state,
        "nonce": nonce,
        "access_type": "offline",             # optional: ask for refresh_token
        "include_granted_scopes": "true",
        "prompt": "consent",                  # or "select_account" depending on UX
    }
    return redirect(f"{GOOGLE_AUTH_URL}?{urlencode(params)}")
 

@auth_blueprint.route("/callback", methods=["GET"])
def auth_callback():
    """
    Handles Google's redirect, exchanges code for tokens,
    verifies id_token (with google-auth), then sets our own JWT cookie.
    """
    error = request.args.get("error")
    if error:
        return abort(400, f"Google error: {error}")

    code = request.args.get("code")
    state = request.args.get("state")
    if not code or not state:
        return abort(400, "Missing code/state")

    # Validate state
    if state != session.get("oauth_state"):
        return abort(400, "Invalid state")
    session.pop("oauth_state", None)

    # Exchange code for tokens
    data = {
        "code": code,
        "client_id": current_app.config["GOOGLE_CLIENT_ID"],
        "client_secret": current_app.config["GOOGLE_CLIENT_SECRET"],
        "redirect_uri": current_app.config["GOOGLE_REDIRECT_URI"],
        "grant_type": "authorization_code",
    }
    token_resp = requests.post(GOOGLE_TOKEN_URL, data=data, timeout=10)
    if token_resp.status_code != 200:
        return abort(400, f"Token exchange failed: {token_resp.text}")
    token_data = token_resp.json()
    id_token_jwt = token_data.get("id_token")
    if not id_token_jwt:
        return abort(400, "No id_token in response")
    
    # Verify id_token using google-auth
    req = google_requests.Request()
    idinfo = google_id_token.verify_oauth2_token(
        id_token_jwt, req, current_app.config["GOOGLE_CLIENT_ID"]
    )

    user = user_service.find_by_email_and_provider({
        "provider_id": idinfo.get('sub'),
        "refresh_token": '',
        "picture": idinfo.get("picture"),
        "email": idinfo.get("email"),
        "provider": "google" # No Plans for other providers    
    })
    
    if not user:
        return render_template("account-not-found.html")
    
    # Verify nonce to bind this login to our original request
    expected_nonce = session.pop("oauth_nonce", None)
    if not expected_nonce or idinfo.get("nonce") != expected_nonce:
        return abort(400, "Invalid nonce")

    # idinfo contains: sub, email, email_verified, name, picture, etc.
    # Create our own app JWT and set cookie
    access_token = create_access_token(identity=str(user.id), additional_claims={
        "email": idinfo.get("email"),
        "name": idinfo.get("name")
    })
    refresh_token = create_refresh_token(identity=str(user.id))
    resp = make_response(redirect(session.pop("post_login_redirect", "/")))
    set_access_cookies(resp, access_token)
    set_refresh_cookies(resp, refresh_token)

    return resp


@auth_blueprint.route("/logout", methods=["POST", "GET"])
def logout():
    resp = make_response(redirect(url_for("auth.login_page")))
    unset_jwt_cookies(resp)
    unset_refresh_cookies(resp)
    return resp

# Example protected page
@auth_blueprint.route("/me", methods=["GET"])
@jwt_required()
def me():
    claims = get_jwt()
    return render_template("profile.html", user={"name":claims.get("jti"), "email": "asdad"})

@auth_blueprint.route("/auth/logout", methods=["POST"])
def logout_with_cookies():
    response = jsonify("Logout successful")
    unset_jwt_cookies(response)
    unset_refresh_cookies(response)
    return response


@auth_blueprint.route("/refresh-cookie", methods=["POST"])
@jwt_required(refresh=True)
def refresh_cookie():
    identity = get_jwt_identity()
    access_token = create_access_token(identity=identity)
    response = jsonify("OK")
    set_access_cookies(response, access_token)
    return response