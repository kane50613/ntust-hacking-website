import { getSessionFromRequest, getUserFromSession } from "~/session";
import type { Info, Route } from "./+types/admin.events.$eventId";
import { redirect } from "react-router";
import { db } from "~/db";
import { asc, eq } from "drizzle-orm";
import { enrolls, events } from "~/db/schema";
import { DataTable } from "~/components/ui/data-table";
import { columns } from "~/components/data-table/enroll-table";
import { Card, CardDescription, CardTitle } from "~/components/ui/card";
import { AdminEventActions } from "~/components/admin-event-actions";

export async function loader({ params, request }: Route.LoaderArgs) {
  const eventId = parseInt(params.eventId);

  const session = await getSessionFromRequest(request);

  if (!(await getUserFromSession(session, "admin"))) throw redirect("/");

  const event = await db.query.events.findFirst({
    where: eq(events.eventId, eventId),
    with: {
      enrolls: {
        orderBy: asc(enrolls.groupId),
        with: {
          user: {
            columns: {
              name: true,
            },
          },
          feedback: true,
          group: {
            columns: {
              name: true,
            },
          },
        },
      },
      teachers: true,
      groups: true,
    },
  });

  if (!event) throw redirect("/admin/events");

  return {
    event,
  };
}

export type AdminEvent = Info["loaderData"]["event"];

export default function Event({ loaderData: { event } }: Route.ComponentProps) {
  const feedbacks = event.enrolls
    .map((enroll) => enroll.feedback)
    .filter(Boolean);

  const rating = feedbacks.length
    ? feedbacks.reduce((total, value) => total + value.rating, 0) /
      feedbacks.length
    : undefined;

  const formattedRating = rating ? rating.toFixed(1) : undefined;

  return (
    <div className="flex flex-col container gap-4 py-8 w-full mx-auto">
      <div className="flex flex-wrap justify-between sm:items-center gap-6">
        <h1 className="text-2xl">{event.title}</h1>
        <AdminEventActions event={event} />
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="p-6">
          <CardTitle className="text-2xl">{event.enrolls.length}</CardTitle>
          <CardDescription>參與者人數</CardDescription>
        </Card>
        <Card className="p-6">
          <CardTitle className="text-2xl">
            {formattedRating ?? "暫無評分"}
          </CardTitle>
          <CardDescription>評分</CardDescription>
        </Card>
        <Card className="p-6">
          <CardTitle className="text-2xl">{event.groups.length}</CardTitle>
          <CardDescription>組別數量</CardDescription>
        </Card>
      </div>
      <DataTable columns={columns} data={event.enrolls} />
    </div>
  );
}
