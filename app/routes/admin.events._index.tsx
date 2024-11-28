import { getSessionFromRequest, getUserFromSession } from "~/session";
import type { Route } from "./+types/admin.events._index";
import { redirect } from "react-router";
import { db } from "~/db";
import { DataTable } from "~/components/ui/data-table";
import { desc } from "drizzle-orm";
import { events } from "~/db/schema";
import { columns } from "~/components/data-table/event-table";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSessionFromRequest(request);

  if (!(await getUserFromSession(session, "admin"))) throw redirect("/");

  return {
    events: await db.query.events.findMany({
      orderBy: desc(events.createdAt),
    }),
  };
}

export default function Users({
  loaderData: { events },
}: Route.ComponentProps) {
  return (
    <div className="flex flex-col container gap-4 py-8 w-full mx-auto">
      <h1 className="text-2xl">活動列表</h1>
      <DataTable columns={columns} data={events} />
    </div>
  );
}
