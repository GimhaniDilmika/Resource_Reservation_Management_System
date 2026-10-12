import { getScheduleTimeline } from "@/lib/data";
import { ScheduleView } from "./ScheduleView";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export default async function SchedulePage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const resolvedParams = await searchParams;
  const initialDate = resolvedParams.date || format(new Date(), "yyyy-MM-dd");
  const { resources } = await getScheduleTimeline(initialDate);

  return <ScheduleView resources={resources} initialDate={initialDate} />;
}
