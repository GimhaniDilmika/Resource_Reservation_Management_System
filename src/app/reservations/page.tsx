import { getReservations, getResources } from "@/lib/data";
import { ReservationsClient } from "./ReservationsClient";

export const dynamic = "force-dynamic";

export default async function ReservationsPage() {
  const [reservations, resources] = await Promise.all([
    getReservations(),
    getResources(),
  ]);

  return <ReservationsClient initialReservations={reservations} allResources={resources} />;
}
