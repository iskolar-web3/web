import { createFileRoute } from "@tanstack/react-router";
import { usePageTitle } from "@/hooks/use-page-title";

export const Route = createFileRoute("/_sponsor/transactions")({
  component: Transactions,
});

function Transactions() {
  usePageTitle("Transactions");

  return (
    <div className="min-h-screen">
      <div className="max-w-[44rem] mx-auto space-y-12 py-6">
        <div>
          <h1 className="text-2xl md:text-3xl text-[#111827]">Transactions</h1>
          <p className="text-sm text-[#6B7280] mt-2">
            Your transaction history will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}

