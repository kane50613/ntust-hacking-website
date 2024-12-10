import type { Invite } from "~/routes/admin.invites._index";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

export const InviteCodeDialog = ({
  invite,
  open,
  setOpen,
}: {
  invite: Invite;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const parts = /^\d{6}$/.test(invite.code)
    ? invite.code.split("")
    : [invite.code];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>邀請碼</DialogTitle>
          <DialogDescription>
            這組邀請碼還可以使用 {invite.maxUsages - invite.uses} 次
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-between text-2xl sm:text-4xl flex-wrap font-semibold w-full">
          {parts.map((part, index) => (
            <div
              key={index}
              className="bg-accent px-4 py-4 sm:px-6 sm:py-4 rounded-lg"
            >
              {part}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
