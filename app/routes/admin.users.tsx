import { getSessionFromRequest, getUserFromSession } from "~/session";
import type { Info, Route } from "./+types/admin.users";
import { redirect } from "react-router";
import { db } from "~/db";
import { DataTable } from "~/components/ui/data-table";
import { desc } from "drizzle-orm";
import { users } from "~/db/schema";
import { columns } from "~/components/data-table/user-table";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSessionFromRequest(request);

  if (!(await getUserFromSession(session, "admin"))) throw redirect("/");

  return {
    users: await db.query.users.findMany({
      orderBy: desc(users.createdAt),
    }),
  };
}

export type User = Info["loaderData"]["users"][number];

export default function Users({ loaderData: { users } }: Route.ComponentProps) {
  return (
    <div className="flex flex-col container gap-4 py-8 w-full mx-auto">
      <h1 className="text-2xl">社員列表</h1>
      <DataTable columns={columns} data={users} />
    </div>
  );
}
