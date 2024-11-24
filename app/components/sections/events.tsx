import { SectionTitle } from "../section-title";
import { Info } from "~/routes/+types/index";

export const Events = ({
  eventRecords,
}: {
  eventRecords: Awaited<Info["loaderData"]["eventRecords"]>;
}) => {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 text-center py-16"
      id="events"
    >
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
