import { db } from "~/db";
import { events } from "~/db/schema";
import type { ComponentProps } from "./+types.index";
import { Hero } from "~/components/hero";

export async function loader() {
  return {
    eventRecords: await db.select().from(events),
  };
}

export default function Index({
  loaderData: { eventRecords },
}: ComponentProps) {
  return (
    <div className="flex flex-col items-center justify-center">
      <Hero />
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        {eventRecords.map((eventRecord) => (
          <div key={eventRecord.eventId}>
            <h2 className="font-sans text-4xl">{eventRecord.title}</h2>
            <p className="font-sans text-xl">{eventRecord.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
