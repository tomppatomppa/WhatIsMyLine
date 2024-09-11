import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { z } from "zod";
import { useAuth } from "../auth";
import Button from "../components /common/Button";
import LandingView from "../views/LandingView";
import React from "react";
import LoginButton from "../components /LoginButton/LoginButton";
import { useGoogleLogin } from "@react-oauth/google";
import { useMutation } from "@tanstack/react-query";
import { googleLogin } from "../API/loginApi";

const fallback = "/dashboard" as const;

export const Route = createFileRoute("/login")({
  validateSearch: z.object({
    redirect: z.string().optional().catch(""),
  }),
  beforeLoad: ({ context, search }) => {
    const isAuthenticated = context.auth.isAuthenticated;
    if (isAuthenticated) {
      throw redirect({ to: search.redirect || fallback });
    }
  },
  component: LoginComponent,
  notFoundComponent: () => {
    return <p>Post not found!</p>;
  },
});

// export const Route = createFileRoute("/login")({
//   validateSearch: z.object({
//     redirect: z.string().optional(),
//   }),
// }).update({
//   component: LoginComponent,
// });
// function slowTimer() {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve(`Timer completed after $ milliseconds`);
//     }, 2000);
//   });
// }

function LoginComponent() {
  const router = useRouter();

  const { auth } = Route.useRouteContext({
    select: ({ auth }) => ({ auth, status: auth.isAuthenticated }),
  });

  const navigate = Route.useNavigate();
  const search = Route.useSearch();

  const { mutate: loginCall } = useMutation({
    mutationFn: googleLogin,
    onSuccess: (user) => {
      auth.login(user);
      router.invalidate().finally(() => {
        navigate({ to: search.redirect || fallback });
      });
    },
  });

  const loginGoogle = useGoogleLogin({
    flow: "auth-code",
    scope: "https://www.googleapis.com/auth/drive",
    onSuccess: async (credentials) => {
      loginCall(credentials.code);
    },
  });
  
  // Ah, the subtle nuances of client side auth. 🙄
  React.useLayoutEffect(() => {
    if (auth.isAuthenticated && search.redirect) {
      router.history.push(search.redirect);
    }
  }, [auth.isAuthenticated, search.redirect]);

  return auth.isAuthenticated ? (
    <div>
      Logged in as <strong>{auth.user?.email}</strong>
      <div className="h-2" />
      <button
        onClick={() => {
          auth.logout();
          router.invalidate();
        }}
        className="text-sm bg-blue-500 text-white border inline-block py-1 px-2 rounded"
      >
        Log out
      </button>
      <div className="h-2" />
    </div>
  ) : (
    <div className="p-2">
      <div>You must log in!</div>
      {/* <LoginButton />  */}
      <div className="h-2" />
      <Button onClick={loginGoogle}>login google</Button>
      {/* <form onSubmit={onSubmit} className="flex gap-2">
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="border p-1 px-2 rounded"
        />
        <button
          type="submit"
          className="text-sm bg-blue-500 text-white border inline-block py-1 px-2 rounded"
        >
          Login
        </button>
      </form> */}
    </div>
  );
}
