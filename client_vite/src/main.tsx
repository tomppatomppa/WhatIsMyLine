import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { GoogleOAuthProvider } from "@react-oauth/google";

import { CLIENT_ID } from "./config.ts";
import { clearCookiesAndLogout, getCookie } from "./utils/helpers.ts";

import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import {
  ErrorComponent,
  RouterProvider,
  createRouter,
} from "@tanstack/react-router";
// Create a new router instance
import { AuthProvider, useAuth } from "./auth.tsx";
import { Spinner } from "./routes/__root.tsx";
import { routeTree } from "./routeTree.gen";
import { refreshToken } from "./API/authApi.ts";

// Create a new router instance

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

async function handleUnauthorized() {
  if (!getCookie("csrf_refresh_token")) return clearCookiesAndLogout();

  if (confirm("Your session has expired. Would you like to refresh?")) {
    try {
      await refreshToken();
      location.reload();
    } catch {
      clearCookiesAndLogout();
    }
  } else {
    clearCookiesAndLogout();
  }
}

const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: (error: any) => {
      const unauthorized = error.response?.status === 401;
      if (unauthorized) {
        handleUnauthorized();
      }
    },
  }),
  queryCache: new QueryCache({
    onError: (error: any) => {
      const unauthorized = error.response?.status === 401;
      if (unauthorized) {
        handleUnauthorized();
      }
    },
  }),
});
const router = createRouter({
  routeTree,
  context: {
    queryClient,
    auth: undefined!,
  },
  defaultPendingComponent: () => (
    <div className="flex items-center justify-center min-h-screen">
      <Spinner />
    </div>
  ),
  defaultErrorComponent: ({ error }) => <ErrorComponent error={error} />,
  defaultPreload: "intent",
  // Since we're using React Query, we don't want loader calls to ever be stale
  // This will ensure that the loader is always called when the route is preloaded or visited
  defaultPreloadStaleTime: 0,
});

function InnerApp() {
  const auth = useAuth();

  return <RouterProvider router={router} context={{ auth }} />;
}

function App() {
  return (
    <AuthProvider>
      <InnerApp />
    </AuthProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={CLIENT_ID}>
    <QueryClientProvider client={queryClient}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </QueryClientProvider>
  </GoogleOAuthProvider>
);
