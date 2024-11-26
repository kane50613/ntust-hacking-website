import { useForm } from "react-hook-form";
import { Form } from "../ui/form";
import type { CreateEventPayload } from "~/routes/api.events.create";
import { createEventSchema } from "~/routes/api.events.create";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DialogContent,
  DialogDescription,
  Dialog,
  DialogTitle,
} from "../ui/dialog";
import { useJsonFetcher } from "~/hook/use-json-fetcher";
import { useEffect } from "react";
import { EventFormFields } from "../fields/event-form-fields";
import { Submit } from "../submit";

export const CreateEventDialog = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const form = useForm<CreateEventPayload>({
    defaultValues: {
      date: new Date(),
    },
    resolver: zodResolver(createEventSchema),
  });

  const [submit, fetcher] =
    useJsonFetcher<CreateEventPayload>("/api/events/create");

  useEffect(() => {
    if (fetcher.data) {
      setOpen(false);
    }
  }, [fetcher.data, setOpen]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogTitle>建立新活動</DialogTitle>
        <DialogDescription>
          建立活動後將會公開並且照開始日期排序
        </DialogDescription>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
            <EventFormFields />
            <Submit className="rounded-full" loading={fetcher.state !== "idle"}>
              建立
            </Submit>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
