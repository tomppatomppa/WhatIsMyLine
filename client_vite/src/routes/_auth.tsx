import {
  createFileRoute,
  Outlet,
  redirect
} from "@tanstack/react-router";

import { useMutation } from "@tanstack/react-query";
import { logout } from "../API/loginApi";
import { useAuth } from "../auth";
import Sidebar from "../components /Sidebar/Sidebar";
import { clearCookiesAndLogout } from "../utils/helpers";

export const Route = createFileRoute("/_auth")({
  beforeLoad: async ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  shouldReload: ({ context }) => {
    return !context.auth.isAuthenticated;
  },
  component: AuthLayout,
});

function AuthLayout() {
  const auth = useAuth();

  const { mutate } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clearCookiesAndLogout();
      auth.logout();
    },
  });

  return (
    <div className="text-center flex flex-row">
      <nav className="z-10 bottom-0 shadow-md flex justify-start bg-primary">
        <Sidebar handleLogout={mutate} />
      </nav>
      <section className="flex-1">
        <Outlet />
      </section>
    </div>
  );
}
