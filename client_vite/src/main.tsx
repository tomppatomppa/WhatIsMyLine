import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { MutationCache, QueryClient, QueryClientProvider } from "react-query";
import { CLIENT_ID } from "./config.ts";
import { removeCookie } from "./utils/helpers.ts";

const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: (error: any) => {
      const { msg } = error?.response?.data
      if (error.response?.status === 401 && msg) {
        window.alert(msg)
        localStorage.removeItem('user')
        removeCookie('csrf_access_token')
        removeCookie('access_token_cookie')
        window.location.href = '/login'
      }
    },
  }),
})

ReactDOM.createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={CLIENT_ID}>
    <QueryClientProvider client={queryClient}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </QueryClientProvider>
  </GoogleOAuthProvider>
);
