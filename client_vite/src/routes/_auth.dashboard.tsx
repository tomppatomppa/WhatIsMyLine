import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Suspense, useState, useTransition } from "react";
import { scriptsQueryOptions, userQueryOptions } from "../API/queryOptions";
import { sleep } from "../auth";
import Button from "../components /common/Button";
import { Script } from "../components /ReaderV3/reader.types";

export const Route = createFileRoute("/_auth/dashboard")({
  loader(opts) {
    opts.context.queryClient.ensureQueryData(userQueryOptions());
  },
  component: DashboardPage,
});

function DashboardPage() {
  const router = useRouter();
  const userQuery = useSuspenseQuery(userQueryOptions());
  const user = userQuery.data;

  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const mockActivity = [
    { id: 1, action: "Logged in", timestamp: "2025-01-24 10:00 AM" },
    {
      id: 2,
      action: "Added new script: analytics.js",
      timestamp: "2025-01-23 3:15 PM",
    },
    { id: 3, action: "Viewed statistics", timestamp: "2025-01-22 8:45 PM" },
  ];

  const handleFeedbackSubmit = async (e: any) => {
    e.preventDefault();
    startTransition(() => {
      sleep(5000);
      setFeedbackMessage("Thank you for your feedback!");
      setFeedback(""); // Clear input field
    });
  };

  return (
    <section className="p-4 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto grid gap-6">
        {/* Welcome Section */}
        <div className="p-6 bg-white shadow rounded-2xl">
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome, {user.email}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here’s what’s happening on your dashboard:
          </p>

          {user.is_admin ? (
            <Button onClick={() => router.navigate({ to: "/logs" })}>
              Logs
            </Button>
          ) : null}
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <StatsGrid />
        </Suspense>
        {/* Latest Activity Section */}
        <div className="p-6 bg-white shadow rounded-2xl">
          <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
          <ul className="mt-4 space-y-2">
            {mockActivity.map((activity) => (
              <li
                key={activity.id}
                className="flex justify-between items-center bg-gray-100 p-4 rounded-lg"
              >
                <span className="text-gray-700">{activity.action}</span>
                <span className="text-gray-500 text-sm">
                  {activity.timestamp}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Feedback Section */}
        <div className="p-6 bg-white shadow rounded-2xl">
          <h2 className="text-xl font-bold text-gray-800">
            Feedback & Feature Requests
          </h2>
          <p className="text-gray-600 mt-2">
            We value your input! Share your feedback or request new features
            below:
          </p>
          <form onSubmit={handleFeedbackSubmit} className="mt-4 space-y-4">
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full p-4 border rounded-lg shadow focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Type your feedback or feature request here..."
              rows={4}
            ></textarea>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 text-white rounded-xl font-semibold shadow-md hover:bg-blue-600"
              disabled={isPending}
            >
              {isPending ? "Submitting..." : "Submit Feedback"}
            </button>
          </form>
          {feedbackMessage && (
            <p className="text-green-600 mt-4">{feedbackMessage}</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default DashboardPage;

function StatsGrid() {
  const router = useRouter();
  const { data } = useSuspenseQuery(scriptsQueryOptions());
  const mockStats = {
    totalScripts: 12,
    activeUsers: 57,
    monthlyViews: 1043,
  };

  const { scripts, deletedScripts } = data.reduce<{
    scripts: Script[];
    deletedScripts: Script[];
  }>(
    (acc, script) => {
      if (script.deleted_at !== null) {
        acc.deletedScripts.push(script);
      } else {
        acc.scripts.push(script);
      }
      return acc;
    },
    { scripts: [], deletedScripts: [] }
  );

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 bg-green-500 text-white rounded-2xl shadow">
          <h2 className="text-lg font-semibold">Active Scripts</h2>
          <p className="text-3xl font-bold">{scripts.length}</p>
        </div>
        <div className="p-6 bg-blue-500 text-white rounded-2xl shadow">
          <h2 className="text-lg font-semibold">Total Scripts</h2>
          <p className="text-3xl font-bold">{data.length}</p>
        </div>

        <div className="p-6 bg-red-500 text-white rounded-2xl shadow">
          <h2 className="text-lg font-semibold">Deleted Scripts</h2>
          <p className="text-3xl font-bold">{deletedScripts.length}</p>
        </div>
        <div className="p-6 bg-purple-500 text-white rounded-2xl shadow">
          <h2 className="text-lg font-semibold">Monthly Views</h2>
          <p className="text-3xl font-bold">{mockStats.monthlyViews}</p>
        </div>
      </div>

      {/* Latest Scripts Section */}
      <div className="p-6 bg-white shadow rounded-2xl">
        <h2 className="text-xl font-bold text-gray-800">
          Latest Added Scripts
        </h2>
        <ul className="mt-4 space-y-2">
          {scripts.slice(0, 5).map((script) => (
            <li
              key={script.id}
              onClick={() =>
                router.navigate({ to: `/scripts/${script.script_id}` })
              }
              className="flex justify-between items-center bg-gray-100 p-4 rounded-lg hover:bg-green-200 cursor-pointer"
            >
              <span className="text-gray-700 font-medium">
                {script.filename}
              </span>
              <span className="text-gray-500 text-sm">
                Added on {script.created_on.toString()}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
