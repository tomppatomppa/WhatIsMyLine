import { createFileRoute } from "@tanstack/react-router";
import { sleep, useAuth } from "../auth";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

const test = async () => {
  await sleep(1000);
  return { message: "message" };
};
export const invoicesQueryOptions = () =>
  queryOptions({
    queryKey: ["invoices"],
    queryFn: () => test(),
  });

export const Route = createFileRoute("/_auth/user/settings")({
  loader(opts) {
    opts.context.queryClient.ensureQueryData(invoicesQueryOptions());
    sleep(5000);
  },

  component: UserSettingsPage,
});

function UserSettingsPage() {
  const invoicesQuery = useSuspenseQuery(invoicesQueryOptions());
  //   const invoices = invoicesQuery.data;
  //   console.log(invoices);
  const auth = useAuth();

  const mockPayments = [
    { id: 1, date: "2025-01-10", amount: "$10.00", status: "Completed" },
    { id: 2, date: "2024-12-10", amount: "$10.00", status: "Completed" },
    { id: 3, date: "2024-11-10", amount: "$10.00", status: "Completed" },
  ];

  const handleCancelSubscription = () => {
    alert("Subscription cancellation is not yet implemented.");
  };

  return (
    <section className="p-4 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto grid gap-6">
        {/* Header */}
        <div className="p-6 bg-white shadow rounded-2xl">
          <h1 className="text-2xl font-bold text-gray-800">User Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your account settings and preferences.
          </p>
        </div>

        {/* Account Info Section */}
        <div className="p-6 bg-white shadow rounded-2xl">
          <h2 className="text-xl font-bold text-gray-800">
            Account Information
          </h2>
          <p className="text-gray-600 mt-2">
            <strong>Email:</strong> {auth.user?.email}
          </p>
          <p className="text-gray-600 mt-1">
            <strong>Joined:</strong> 2024-01-15
          </p>
        </div>

        {/* Subscription Management */}
        <div className="p-6 bg-white shadow rounded-2xl">
          <h2 className="text-xl font-bold text-gray-800">Subscription</h2>
          <p className="text-gray-600 mt-2">
            You are currently subscribed to the <strong>Pro Plan</strong>.
          </p>
          <button
            onClick={handleCancelSubscription}
            className="mt-4 py-2 px-4 bg-red-500 text-white rounded-xl font-semibold shadow-md hover:bg-red-600"
          >
            Cancel Subscription
          </button>
        </div>

        {/* Payment History */}
        <div className="p-6 bg-white shadow rounded-2xl">
          <h2 className="text-xl font-bold text-gray-800">Payment History</h2>
          <ul className="mt-4 space-y-2">
            {mockPayments.map((payment) => (
              <li
                key={payment.id}
                className="flex justify-between items-center bg-gray-100 p-4 rounded-lg"
              >
                <span className="text-gray-700">{payment.date}</span>
                <span className="text-gray-500">{payment.amount}</span>
                <span className="text-green-600">{payment.status}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default UserSettingsPage;
