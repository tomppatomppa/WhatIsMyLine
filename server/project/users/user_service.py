from sqlalchemy import select
from project import db
from project.models import User
from manage import Session


def get_by_id(user_id: int) -> User | None:
    with Session() as session:
        result = session.get(User, user_id)
        return result

def get_refresh_token(user_id: int) -> str | None:
    user = get_by_id(user_id)
    return user.refresh_token if user else None


def update_refresh_token(user_id: int, refresh_token: str) -> bool:
    user = get_by_id(user_id)
    if not user:
        return False
    user.refresh_token = refresh_token
    db.session.commit()
    return True


def find_by_email_and_provider(user_info: dict):
    q = select(User).where(
        User.provider_id == user_info["provider_id"],
        User.email == user_info["email"],
        User.provider == user_info["provider"],
    )
    with Session() as session:
        result = session.scalars(q).one_or_none()
        return result


def find_or_create(user_info: dict) -> User:
    user = User.query.filter_by(
        provider_id=user_info["provider_id"],
        email=user_info["email"],
        provider=user_info["provider"],
    ).first()

    if not user:
        user = User(
            provider_id=user_info["provider_id"],
            picture=user_info.get("picture", ""),
            email=user_info["email"],
            provider=user_info["provider"],
            refresh_token=user_info["refresh_token"],
        )
        db.session.add(user)
        db.session.commit()
    return user
