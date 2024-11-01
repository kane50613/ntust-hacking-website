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
  return <div>{eventRecords.join(", ")}</div>;
}
