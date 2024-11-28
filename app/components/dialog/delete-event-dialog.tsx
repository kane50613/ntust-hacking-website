import {
  DialogContent,
  Dialog,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useJsonFetcher } from "~/hook/use-json-fetcher";
import { useEffect } from "react";
import type { events } from "~/db/schema";

export const DeleteEventDialog = ({
  open,
  setOpen,
  event,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  event: typeof events.$inferSelect;
}) => {
  const [submit, fetcher] = useJsonFetcher(
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
