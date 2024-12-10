import { getSessionFromRequest, getUserFromSession } from "~/session";
import type { Route } from "./+types/admin.invites._index";
import { redirect } from "react-router";
import { db } from "~/db";
import { invites, inviteUses, users } from "~/db/schema";
import { count, eq, getTableColumns } from "drizzle-orm";
import { DataTable } from "~/components/ui/data-table";
import { columns } from "~/components/data-table/invite-table";
import { Button } from "~/components/ui/button";
import { CreateInviteDialog } from "~/components/dialog/create-invite-dialog";
import { useState } from "react";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSessionFromRequest(request);

  if (!(await getUserFromSession(session, "admin"))) throw redirect("/");

  return await db
    .select({
      ...getTableColumns(invites),
      uses: count(inviteUses.inviteUseId),
      createdBy: users,
    })
    .from(invites)
    .leftJoin(inviteUses, eq(inviteUses.inviteId, invites.inviteId))
    .leftJoin(users, eq(invites.createdBy, users.userId))
    .groupBy(invites.inviteId, users.userId);
}

export type Invite = Awaited<ReturnType<typeof loader>>[number];

export default function Invites({ loaderData }: Route.ComponentProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col container gap-4 py-8 w-full mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl">邀請碼列表</h1>
        <Button onClick={() => setIsOpen(true)}>建立</Button>
        <CreateInviteDialog open={isOpen} setOpen={setIsOpen} />
      </div>
      <DataTable columns={columns} data={loaderData} />
    </div>
  );
}
