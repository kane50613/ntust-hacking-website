import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useInviteSchema } from "~/routes/api.invites.use";
import { Form } from "../ui/form";
import { UseInviteCodeFormFields } from "../fields/use-invite-code-form-fields";
import { useJsonFetcher } from "~/hook/use-json-fetcher";
import { Submit } from "../submit";
import { useEffect } from "react";

export function UseInviteCodeDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const form = useForm({
    resolver: zodResolver(useInviteSchema),
  });

  const [submit, fetcher] = useJsonFetcher("/api/invites/use");

  useEffect(() => {
    if (fetcher.data) {
      setOpen(false);
    }
  }, [fetcher.data, setOpen]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogTitle>使用邀請碼</DialogTitle>
        <DialogDescription>可向社團幹部詢問邀請碼</DialogDescription>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
            <UseInviteCodeFormFields />
            <Submit loading={fetcher.state !== "idle"}>使用</Submit>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
