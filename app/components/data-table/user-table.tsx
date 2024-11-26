import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import type { User } from "~/routes/admin.users";
import { EditUserDialog } from "../dialog/edit-user-dialog";
import { Button } from "../ui/button";
import { SquarePen, Trash } from "lucide-react";

const dateFormatter = new Intl.DateTimeFormat("zh-TW", {
  dateStyle: "full",
});

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "avatar",
    header: "頭像",
    cell({ getValue }) {
      return (
        <img
          src={getValue() as string}
          className="rounded-full w-8 aspect-square shadow-lg"
          alt="user avatar"
        />
      );
    },
  },
  {
    accessorKey: "userId",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "姓名",
  },
  {
    accessorKey: "email",
    header: "電子郵件",
  },
  {
    accessorKey: "role",
    header: "權限",
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
    cell: ({ row }) => <Actions user={row.original} />,
  },
];

const Actions = ({ user }: { user: User }) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="flex gap-2">
      <EditUserDialog
        defaultValues={user}
        open={isEditing}
        setOpen={setIsEditing}
        userId={user.userId}
      />
      <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)}>
        <SquarePen className="w-4 h-4" />
      </Button>
      <Button size="sm" variant="destructive">
        <Trash className="w-4 h-4" />
      </Button>
    </div>
  );
};
