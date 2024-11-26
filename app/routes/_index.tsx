import { db } from "~/db";
import { enrolls, events, feedbacks } from "~/db/schema";
import type { Route } from "~/routes/+types/_index";
import { Hero } from "~/components/hero";
import { Events } from "~/components/sections/events";
import { and, avg, count, desc, eq, getTableColumns, sql } from "drizzle-orm";
import { lazy } from "react";
import { getSessionFromRequest } from "~/session";
import { Contacts } from "~/components/sections/contacts";
import { alias } from "drizzle-orm/pg-core";

function getEventRecords() {
  return db
    .select({
      ...getTableColumns(events),
      enrollsCount: count(enrolls.userId),
      rating: avg(feedbacks.rating),
      enrollId: sql<null>`null`,
      feedback: sql<null>`null`,
    })
    .from(events)
    .leftJoin(enrolls, eq(events.eventId, enrolls.eventId))
    .leftJoin(feedbacks, eq(enrolls.enrollId, feedbacks.enrollId))
    .orderBy(desc(events.date))
    .groupBy(events.eventId)
    .execute();
}

const personalEnrollsTable = alias(enrolls, "personal_enrolls");
const personalFeedbacksTable = alias(feedbacks, "personal_feedbacks");

function getEventRecordsWithUser(userId: number) {
  return db
    .select({
      ...getTableColumns(events),
      enrollsCount: count(enrolls.userId),
      rating: sql<string>`trunc(${avg(feedbacks.rating)}, 1)`,
      enrollId: personalEnrollsTable.enrollId,
      feedback: personalFeedbacksTable,
    })
    .from(events)
    .leftJoin(enrolls, eq(events.eventId, enrolls.eventId))
    .leftJoin(feedbacks, eq(enrolls.enrollId, feedbacks.enrollId))
    .leftJoin(
      personalEnrollsTable,
      and(
        eq(events.eventId, personalEnrollsTable.eventId),
        eq(personalEnrollsTable.userId, userId)
      )
    )
    .leftJoin(
      personalFeedbacksTable,
      eq(personalEnrollsTable.enrollId, personalFeedbacksTable.enrollId)
    )
    .orderBy(desc(events.date))
    .groupBy(
      events.eventId,
      personalEnrollsTable.enrollId,
      personalFeedbacksTable.feedbackId
    )
    .execute();
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);

  const session = await getSessionFromRequest(request);

  const isRed =
    request.headers.get("user-agent")?.includes("Red") ||
    url.searchParams.has("red");

  return {
    eventRecords: session.data.userId
      ? getEventRecordsWithUser(session.data.userId)
      : getEventRecords(),
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

const MouseGlowBackground = lazy(
  () => import("../components/mouse-glow-background")
);

export default function Index({
  loaderData: { eventRecords, isRed },
}: Route.ComponentProps) {
  return (
    <>
      <div className="absolute top-0 left-0 w-full h-[80dvh] z-0">
        <MouseGlowBackground />
      </div>
      <div className="flex flex-col items-center justify-center">
        <Hero isRed={isRed} />
        <Events eventRecords={eventRecords} />
        <Contacts />
      </div>
    </>
  );
}
