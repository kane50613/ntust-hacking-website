import { useForm } from "react-hook-form";
import { Form } from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DialogContent,
  Dialog,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useJsonFetcher } from "~/hook/use-json-fetcher";
import { useEffect } from "react";
import { EventFormFields } from "../fields/event-form-fields";
import type { EditEventPayload } from "~/routes/api.events.$eventId.edit";
import { editEventSchema } from "~/routes/api.events.$eventId.edit";

export const EditEventDialog = ({
  open,
  setOpen,
  defaultValues,
  eventId,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  defaultValues: EditEventPayload;
  eventId: number;
}) => {
  const form = useForm<EditEventPayload>({
    defaultValues,
    resolver: zodResolver(editEventSchema),
  });

  const [submit, fetcher] = useJsonFetcher<EditEventPayload>(
    `/api/events/${eventId}/edit`
  );

  useEffect(() => {
    if (fetcher.data) {
      setOpen(false);
    }
  }, [fetcher.data, setOpen]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogTitle>編輯活動</DialogTitle>
        <DialogDescription>{defaultValues.title}</DialogDescription>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
            <EventFormFields />
            <Button
              type="submit"
              className="rounded-full"
              disabled={fetcher.state !== "idle"}
            >
              編輯
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
