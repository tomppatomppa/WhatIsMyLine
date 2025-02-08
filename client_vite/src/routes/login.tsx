import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { z } from "zod";
import { sleep } from "../auth";

import { useGoogleLogin } from "@react-oauth/google";
import { useMutation } from "@tanstack/react-query";
import { googleLogin } from "../API/loginApi";

const fallback = "/dashboard" as const;

export const Route = createFileRoute("/login")({
  validateSearch: z.object({
    redirect: z.string().optional().catch(""),
  }),
  beforeLoad: async ({ context, search }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect || fallback });
    }
  },
  component: LoginComponent,
  notFoundComponent: () => {
    return <p>Post not found!</p>;
  },
});

function LoginComponent() {
  const router = useRouter();

  const { auth } = Route.useRouteContext({
    select: ({ auth }) => ({ auth, status: auth.isAuthenticated }),
  });

  const navigate = Route.useNavigate();
  const search = Route.useSearch();

  const { mutate: loginCall, isPending } = useMutation({
    mutationFn: googleLogin,
    onSuccess: async (_user) => {
      auth.login();
      await router.invalidate();
      await sleep(2); // @hack to make navigate work
      await navigate({ to: search.redirect || fallback });
    },
  });

  const loginGoogle = useGoogleLogin({
    flow: "auth-code",
    scope: "https://www.googleapis.com/auth/drive",
    onSuccess: async (credentials) => {
      loginCall(credentials.code);
    },
  });

  if (isPending) {
    return (
      <Container>
        <Spinner />
      </Container>
    );
  }

  return (
    <Container>
      <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-10 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gray-700">Login</h1>
        <p className="text-gray-500 mt-2">Access your account with Google</p>
        <div className="mt-8">
          <button
            onClick={loginGoogle}
            className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-blue-500 text-white rounded-xl font-semibold shadow-md hover:bg-blue-600"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
              alt="Google Logo"
              className="w-5 h-5"
            />
            Sign in with Google
          </button>
        </div>
      </div>
    </Container>
  );
}

const Spinner = () => {
  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gray-100">
      <svg
        className="animate-spin h-12 w-12 text-blue-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8H4z"
        ></path>
      </svg>
    </div>
  );
};

const Container = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {children}
    </div>
  );
};
