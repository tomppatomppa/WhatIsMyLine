import {
  createFileRoute,
  Outlet,
  redirect
} from "@tanstack/react-router";

import { NavbarPrivate } from "../layout/Navbar";

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
  // const auth = useAuth();

  // const { mutate } = useMutation({
  //   mutationFn: logout,
  //   onSettled: () => {
  //     clearCookiesAndLogout();
  //     auth.logout();
  //   }
  // });

  return (
    <div className="text-center flex flex-row my-16">
      <nav className="z-10 bottom-0 shadow-md flex justify-start bg-primary">
         <NavbarPrivate />
      </nav>
      <section className="flex-1">
        <Outlet />
      </section>
    </div>
  );
}
