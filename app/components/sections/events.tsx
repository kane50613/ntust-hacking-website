import { events } from "~/db/schema";
import { SectionTitle } from "../section-title";

export const Events = ({
  eventRecords,
}: {
  eventRecords: (typeof events.$inferSelect)[];
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 text-center py-16">
      <SectionTitle>社團課資訊</SectionTitle>
      {eventRecords.map((eventRecord) => (
        <div key={eventRecord.eventId}>
          <h2 className="font-sans text-4xl">{eventRecord.title}</h2>
          <p className="font-sans text-xl">{eventRecord.description}</p>
        </div>
      ))}
    </div>
  );
};
