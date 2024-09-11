import {
  createFileRoute,
  Outlet,
  redirect,
  useRouter,
} from "@tanstack/react-router";

import Sidebar from "../components /Sidebar/Sidebar";
import { useAuth } from "../auth";
import { getAuth } from "../API/authApi";
import { clearCookiesAndLogout } from "../utils/helpers";
import { useLogout } from "../store/userStore";
import { useMutation } from "@tanstack/react-query";
import { logout } from "../API/loginApi";

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
  shouldReload({ context }) {
    console.log("RELOAD")
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

  console.log(auth);
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
