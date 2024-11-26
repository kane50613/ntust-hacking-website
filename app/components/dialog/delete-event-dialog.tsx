import {
  DialogContent,
  Dialog,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useJsonFetcher } from "~/hook/use-json-fetcher";
import { useEffect } from "react";
import type { EditEventPayload } from "~/routes/api.events.$eventId.edit";
import type { Event } from "../card/event-card";

export const DeleteEventDialog = ({
  open,
  setOpen,
  event
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  event: Event
}) => {
  const [submit, fetcher] = useJsonFetcher<EditEventPayload>(
    `/api/events/${event.eventId}/delete`
  );

  useEffect(() => {
    if (fetcher.data) {
      setOpen(false);
    }
  }, [fetcher.data, setOpen]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogTitle>刪除 {event.title}</DialogTitle>
        <DialogDescription>刪除後將無法復原，請謹慎操作</DialogDescription>
        <Button
          className="rounded-full"
          disabled={fetcher.state !== "idle"}
          variant="destructive"
          onClick={() => submit({})}
        >
          刪除
        </Button>
      </DialogContent>
    </Dialog>
  );
};
