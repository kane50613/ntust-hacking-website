import { getSessionFromRequest, getUserFromSession } from "~/session";
import type { Info, Route } from "./+types/admin.events._index";
import { redirect } from "react-router";
import { db } from "~/db";
import { DataTable } from "~/components/ui/data-table";
import { desc } from "drizzle-orm";
import { events } from "~/db/schema";
import { columns } from "~/components/data-table/event-table";
import { Button } from "~/components/ui/button";
import { useState } from "react";
import { CreateEventDialog } from "~/components/dialog/create-event-dialog";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSessionFromRequest(request);

  if (!(await getUserFromSession(session, "admin"))) throw redirect("/");

  return {
    events: await db.query.events.findMany({
      orderBy: desc(events.eventId),
      with: {
        teachers: {
          columns: {
            teacherId: true,
          }
        }
      }
    }),
  };
}

export type AdminListEvent = Info["loaderData"]["events"][number];

export default function Users({
  loaderData: { events },
}: Route.ComponentProps) {
  const [isCreating, setIsCreating] = useState(false);
  
  return (
    <div className="flex flex-col container gap-4 py-8 w-full mx-auto">
    <CreateEventDialog open={isCreating} setOpen={setIsCreating}/>
      <div className="flex justify-between items-center">
      <h1 className="text-2xl">活動列表</h1>
      <Button onClick={() => setIsCreating(true)}>
        建立
      </Button>
      </div>
      <DataTable columns={columns} data={events} />
    </div>
  );
}
