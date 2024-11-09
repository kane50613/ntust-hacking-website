import { db } from "~/db";
import { events } from "~/db/schema";
import type { ComponentProps, LoaderArgs } from "./+types.index";
import { Hero } from "~/components/hero";
import { Events } from "~/components/sections/events";
import { Await } from "react-router";
import { Suspense } from "react";
import { AsyncError } from "~/components/async-error";

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);

  const isRed =
    request.headers.get("user-agent")?.includes("Red") ||
    url.searchParams.has("red");

  return {
    eventRecords: db.select().from(events).execute(),
    isRed,
  };
}

export function meta() {
  return [
    {
      title: "台科大資訊安全研究社",
      description:
        "「你，渴望魔法嗎？」台科資安社作為頂尖的網路黑魔法重地，擁有龐大的黑魔法教育資源，更培育出多位國家戰略級魔法師。渴望魔法嗎？加入我們！",
    },
  ];
}

export default function Index({
  loaderData: { eventRecords, isRed },
}: ComponentProps) {
  return (
    <div className="flex flex-col items-center justify-center">
      <Hero isRed={isRed} />
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={eventRecords} errorElement={<AsyncError />}>
          {(eventRecords) => <Events eventRecords={eventRecords} />}
        </Await>
      </Suspense>
    </div>
  );
}
