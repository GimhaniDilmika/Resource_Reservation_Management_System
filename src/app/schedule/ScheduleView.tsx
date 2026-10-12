"use client";

import { useState } from "react";
import { format } from "date-fns";
import { TimelineGrid } from "@/components/TimelineGrid";
import { BookingModal, ResourceLite } from "@/components/BookingModal";
import { useRouter } from "next/navigation";

interface ScheduleViewProps {
  resources: any[];
  initialDate: string;
}

export function ScheduleView({ resources, initialDate }: ScheduleViewProps) {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(initialDate || format(new Date(), "yyyy-MM-dd"));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedResourceId, setSelectedResourceId] = useState<string | undefined>(undefined);
  const [slotStart, setSlotStart] = useState<string | undefined>(undefined);
  const [slotEnd, setSlotEnd] = useState<string | undefined>(undefined);

  const resourcesLite: ResourceLite[] = resources.map((r) => ({
    id: r.id,
    name: r.name,
    code: r.code,
    location: r.location,
    capacity: r.capacity,
    maxDurationMinutes: r.maxDurationMinutes,
    isApprovalRequired: r.isApprovalRequired,
    category: { name: r.category.name },
  }));

  const handleSelectSlot = (resourceId: string, startIso: string, endIso: string) => {
    setSelectedResourceId(resourceId);
    setSlotStart(startIso);
    setSlotEnd(endIso);
    setIsModalOpen(true);
  };

  const handleDateChange = (newDateStr: string) => {
    setCurrentDate(newDateStr);
    router.push(`/schedule?date=${newDateStr}`);
  };

  return (
    <div>
      <TimelineGrid
        resources={resources}
        targetDate={currentDate}
        onSelectSlot={handleSelectSlot}
        onDateChange={handleDateChange}
      />

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        resources={resourcesLite}
        preselectedResourceId={selectedResourceId}
        initialStartTime={slotStart}
        initialEndTime={slotEnd}
        onSuccess={() => {
          router.refresh();
        }}
      />
    </div>
  );
}
