import { db } from "~/db";
import { events } from "~/db/schema";
import type { ComponentProps } from "./+types.index";

export async function loader() {
  return {
    eventRecords: await db.select().from(events),
  };
}

export default function Index({
  loaderData: { eventRecords },
}: ComponentProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="font-sans text-[8vw]">「你，渴望魔法嘛？」</h1>
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
