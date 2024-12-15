import { useForm } from "react-hook-form";
import { Form } from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DialogContent,
  Dialog,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { useJsonFetcher } from "~/hook/use-json-fetcher";
import { useEffect } from "react";
import { UserFormFields } from "../fields/user-form-fields";
import type { EditUserPayload } from "~/routes/api.users.$userId.edit";
import { editUserSchema } from "~/routes/api.users.$userId.edit";
import { Submit } from "../submit";

export const EditUserDialog = ({
  open,
  setOpen,
  defaultValues,
  userId,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  defaultValues: EditUserPayload;
  userId: number;
}) => {
  const form = useForm<EditUserPayload>({
    defaultValues,
    resolver: zodResolver(editUserSchema),
  });

  const [submit, fetcher] = useJsonFetcher<EditUserPayload>(
    `/api/users/${userId}/edit`
  );

  useEffect(() => {
    if (fetcher.data) {
      setOpen(false);
    }
  }, [fetcher.data, setOpen]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogTitle>編輯社員</DialogTitle>
        <DialogDescription>{defaultValues.name} 的社員資料</DialogDescription>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
            <UserFormFields />
            <Submit className="rounded-full" loading={fetcher.state !== "idle"}>
              編輯
            </Submit>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
