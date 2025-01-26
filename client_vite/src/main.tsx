import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { GoogleOAuthProvider } from "@react-oauth/google";

import { CLIENT_ID } from "./config.ts";
import { clearCookiesAndLogout, getCookie } from "./utils/helpers.ts";

import { ErrorComponent, RouterProvider, createRouter } from "@tanstack/react-router";
import {
  QueryClient,
  MutationCache,
  QueryCache,
  QueryClientProvider,
} from "@tanstack/react-query";
// Create a new router instance
import { routeTree } from "./routeTree.gen";
import { AuthProvider, useAuth } from "./auth.tsx";
import { Spinner } from "./routes/__root.tsx";

// Create a new router instance

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: (error: any) => {
      const { msg } = error?.response?.data;
      if (error.response?.status === 401 && msg) {
       // clearCookiesAndLogout(msg);
      }
    },
  }),
  queryCache: new QueryCache({
    onError: (error: any) => {
      if (error.response?.status === 401 && getCookie("csrf_access_token")) {
        clearCookiesAndLogout("Logout");
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
