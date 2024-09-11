import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";
import LandingView from "../views/LandingView";

const fallback = "/dashboard" as const;

export const Route = createFileRoute("/")({
  validateSearch: z.object({
    redirect: z.string().optional().catch(""),
  }),
  beforeLoad: ({ context, search }) => {
    const isAutheticated = context.auth.isAuthenticated;
    if (isAutheticated) {
      throw redirect({ to: search.redirect || fallback });
    }
  },
  component: LandingView,
  notFoundComponent: () => {
    return <p>Post not found!</p>;
  },
});

