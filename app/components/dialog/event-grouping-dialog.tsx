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
import { Submit } from "../submit";
import type { events } from "~/db/schema";
import type { CreateGroupingPayload } from "~/routes/api.events.$eventId.create-grouping";
import { createGroupingSchema } from "~/routes/api.events.$eventId.create-grouping";
import { EventGroupingFormFields } from "../fields/event-grouping-form-fields";

export const EventGroupingDialog = ({
  open,
  setOpen,
  event,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  event: typeof events.$inferSelect;
}) => {
  const form = useForm<CreateGroupingPayload>({
    resolver: zodResolver(createGroupingSchema),
    defaultValues: {
      amount: 3,
    },
  });

  const [submit, fetcher] = useJsonFetcher<CreateGroupingPayload>(
    `/api/events/${event.eventId}/create-grouping`
  );

  useEffect(() => {
    if (fetcher.data) {
      setOpen(false);
    }
  }, [fetcher.data, setOpen]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogTitle>隨機分組</DialogTitle>
        <DialogDescription>{event.title}</DialogDescription>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
            <EventGroupingFormFields />
            <Submit className="rounded-full" loading={fetcher.state !== "idle"}>
              送出
            </Submit>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
