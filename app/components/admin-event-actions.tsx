import { useState } from "react";
import { EditEventDialog } from "./dialog/edit-event-dialog";
import { Button } from "./ui/button";
import { DeleteEventDialog } from "./dialog/delete-event-dialog";
import type { events } from "~/db/schema";
import { EventGroupingDialog } from "./dialog/event-grouping-dialog";

export const AdminEventActions = ({
  event,
}: {
  event: typeof events.$inferSelect;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isGrouping, setIsGrouping] = useState(false);

  return (
    <div className="flex gap-4">
      <EditEventDialog
        defaultValues={event}
        open={isEditing}
        setOpen={setIsEditing}
        eventId={event.eventId}
      />
      <DeleteEventDialog
        open={isDeleting}
        setOpen={setIsDeleting}
        event={event}
      />
      <EventGroupingDialog
        open={isGrouping}
        setOpen={setIsGrouping}
        event={event}
      />
      <Button onClick={() => setIsEditing(true)}>編輯活動</Button>
      <Button onClick={() => setIsGrouping(true)}>隨機分組</Button>
      <Button variant="destructive" onClick={() => setIsDeleting(true)}>
        刪除活動
      </Button>
    </div>
  );
};
