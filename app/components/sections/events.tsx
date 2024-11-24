import { EventCard } from "../event-card";
import { SectionTitle } from "../section-title";
import { Info } from "~/routes/+types/index";

export const Events = ({
  eventRecords,
}: {
  eventRecords: Awaited<Info["loaderData"]["eventRecords"]>;
}) => {
  return (
    <div
      className="flex flex-col items-center justify-center gap-12 text-center py-16"
      id="events"
    >
      <SectionTitle>社團課資訊</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 container">
        {eventRecords.map((eventRecord) => (
          <EventCard key={eventRecord.eventId} event={eventRecord} />
        ))}
      </div>
    </div>
  );
};
