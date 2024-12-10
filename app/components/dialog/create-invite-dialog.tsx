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

export const CreateInviteDialog = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const form = useForm<CreateInvitePayload>({
    defaultValues: {
      maxUsages: 1,
    },
    resolver: zodResolver(createInviteSchema),
  });

  const [submit, fetcher] = useJsonFetcher<CreateInvitePayload>(
    "/api/invites/create"
  );

  useEffect(() => {
    if (fetcher.data) {
      setOpen(false);
    }
  }, [fetcher.data, setOpen]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogTitle>建立邀請碼</DialogTitle>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
            <InviteFormFields />
            <Submit className="rounded-full" loading={fetcher.state !== "idle"}>
              建立
            </Submit>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
