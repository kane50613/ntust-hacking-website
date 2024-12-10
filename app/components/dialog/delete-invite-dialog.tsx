import {
  DialogContent,
  Dialog,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { useJsonFetcher } from "~/hook/use-json-fetcher";
import { useEffect } from "react";
import { Submit } from "../submit";
import type { Invite } from "~/routes/admin.invites._index";

export const DeleteInviteDialog = ({
  open,
  setOpen,
  invite,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  invite: Invite;
}) => {
  const [submit, fetcher] = useJsonFetcher(
    `/api/invites/${invite.inviteId}/delete`
  );

  useEffect(() => {
    if (fetcher.data) {
      setOpen(false);
    }
  }, [fetcher.data, setOpen]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogTitle>刪除邀請碼</DialogTitle>
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
