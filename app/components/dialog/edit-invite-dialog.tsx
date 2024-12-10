import { useForm } from "react-hook-form";
import { Form } from "../ui/form";
import type { CreateInvitePayload } from "~/routes/api.invites.create";
import { createInviteSchema } from "~/routes/api.invites.create";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogContent, Dialog, DialogTitle } from "../ui/dialog";
import { useJsonFetcher } from "~/hook/use-json-fetcher";
import { useEffect } from "react";
import { InviteFormFields } from "../fields/invite-form-fields";
import { Submit } from "../submit";
import type { EditInvitePayload } from "~/routes/api.invites.$inviteId.edit";
import type { Invite } from "~/routes/admin.invites._index";

export const EditInviteDialog = ({
  open,
  setOpen,
  invite,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  invite: Invite;
}) => {
  const form = useForm<EditInvitePayload>({
    defaultValues: invite,
    resolver: zodResolver(createInviteSchema),
  });

  const [submit, fetcher] = useJsonFetcher<EditInvitePayload>(
    `/api/invites/${invite.inviteId}/edit`
  );

  useEffect(() => {
    if (fetcher.data) {
      setOpen(false);
    }
  }, [fetcher.data, setOpen]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogTitle>編輯邀請碼</DialogTitle>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
            <InviteFormFields />
            <Submit className="rounded-full" loading={fetcher.state !== "idle"}>
              編輯
            </Submit>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
