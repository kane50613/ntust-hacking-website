import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import type { Invite } from "~/routes/admin.invites._index";
import { Button } from "../ui/button";
import { LinkIcon, Trash } from "lucide-react";
import { InviteCodeDialog } from "../dialog/invite-code-dialog";
import { DeleteInviteDialog } from "../dialog/delete-invite-dialog";

export const columns: ColumnDef<Invite>[] = [
  {
    accessorKey: "inviteId",
    header: "編號",
  },
  {
    accessorKey: "createdBy.name",
    header: "建立者",
  },
  {
    accessorKey: "createdAt",
    header: "建立時間",
  },
  {
    id: "uses",
    accessorFn(row) {
      const max = row.maxUsages ?? "無限";

      return `${row.uses} / ${max}`;
    },
    header: "使用次數",
  },
  {
    id: "actions",
    header: "操作",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <ViewCodeButton invite={row.original} />
        <DeleteButton invite={row.original} />
      </div>
    ),
  },
];

const ViewCodeButton = ({ invite }: { invite: Invite }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <InviteCodeDialog open={isOpen} setOpen={setIsOpen} invite={invite} />
      <Button
        size="sm"
        variant="ghost"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        <LinkIcon className="w-4 h-4" />
      </Button>
    </>
  );
};

const DeleteButton = ({ invite }: { invite: Invite }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <DeleteInviteDialog open={isOpen} setOpen={setIsOpen} invite={invite} />
      <Button
        size="sm"
        variant="destructive"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        <Trash className="w-4 h-4" />
      </Button>
    </>
  );
};
