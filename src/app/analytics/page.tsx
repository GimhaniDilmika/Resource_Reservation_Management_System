import { getAnalyticsSummary } from "@/lib/data";
import { AnalyticsClient } from "./AnalyticsClient";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const summary = await getAnalyticsSummary();
  return <AnalyticsClient data={summary} />;
}
