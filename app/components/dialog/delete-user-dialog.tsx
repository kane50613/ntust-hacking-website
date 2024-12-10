import {
  DialogContent,
  Dialog,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useJsonFetcher } from "~/hook/use-json-fetcher";
import { useEffect } from "react";
import type { User } from "~/routes/admin.users";
import { Submit } from "../submit";

export const DeleteUserDialog = ({
  open,
  setOpen,
  user,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  user: User;
}) => {
  const [submit, fetcher] = useJsonFetcher(`/api/users/${user.userId}/delete`);

  useEffect(() => {
    if (fetcher.data) {
      setOpen(false);
    }
  }, [fetcher.data, setOpen]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogTitle>刪除 {user.name}</DialogTitle>
        <DialogDescription>刪除後將無法復原，請謹慎操作</DialogDescription>
        <Submit
          className="rounded-full"
          loading={fetcher.state !== "idle"}
          variant="destructive"
          onClick={() => submit({})}
        >
          刪除
        </Submit>
      </DialogContent>
    </Dialog>
  );
};
