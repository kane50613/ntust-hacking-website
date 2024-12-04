import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { Button } from "../ui/button";
import { SquarePen, Trash } from "lucide-react";
import { EditEventDialog } from "../dialog/edit-event-dialog";
import { DeleteEventDialog } from "../dialog/delete-event-dialog";
import type { events } from "~/db/schema";
import { Link } from "react-router";

const dateFormatter = new Intl.DateTimeFormat("zh-TW", {
  dateStyle: "full",
});

export const columns: ColumnDef<typeof events.$inferSelect>[] = [
  {
    accessorKey: "eventId",
    header: "ID",
  },
  {
    accessorKey: "title",
    header: "活動名稱",
    cell({ getValue, row }) {
      return (
        <Link to={`/admin/events/${row.original.eventId}`}>
          {getValue() as string}
        </Link>
      );
    },
  },
  {
    accessorKey: "date",
    header: "日期",
    cell({ getValue }) {
      return dateFormatter.format(getValue() as Date);
    },
  },
  {
    accessorKey: "createdAt",
    header: "創建時間",
    cell({ getValue }) {
      return dateFormatter.format(getValue() as Date);
    },
  },
  {
    id: "actions",
    header: "操作",
    cell: ({ row }) => <Actions event={row.original} />,
  },
];

const Actions = ({ event }: { event: typeof events.$inferSelect }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <div className="flex gap-2">
      <EditEventDialog
        defaultValues={event}
        open={isEditing}
        setOpen={setIsEditing}
        eventId={event.eventId}
      />
      <DeleteEventDialog
        open={isDeleting}
        setOpen={setIsDeleting}
        event={event}
      />
      <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)}>
        <SquarePen className="w-4 h-4" />
      </Button>
      <Button
        size="sm"
        variant="destructive"
        onClick={() => setIsDeleting(true)}
      >
        <Trash className="w-4 h-4" />
      </Button>
    </div>
  );
};
