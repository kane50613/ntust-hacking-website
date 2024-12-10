import { useState } from "react";
import { EditEventDialog } from "./dialog/edit-event-dialog";
import { Button } from "./ui/button";
import { DeleteEventDialog } from "./dialog/delete-event-dialog";
import { EventGroupingDialog } from "./dialog/event-grouping-dialog";
import { Dice6, Pencil, Trash2 } from "lucide-react";
import type { AdminEvent } from "~/routes/admin.events.$eventId";

export const AdminEventActions = ({ event }: { event: AdminEvent }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isGrouping, setIsGrouping] = useState(false);

  return (
    <div className="flex gap-4">
      <EditEventDialog
        defaultValues={{
          ...event,
          teacherIds: event.teachers.map((teacher) => teacher.userId),
        }}
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
      <Button onClick={() => setIsEditing(true)} variant="outline">
        <Pencil className="w-4 h-4" />
        編輯活動
      </Button>
      <Button onClick={() => setIsGrouping(true)} variant="outline">
        <Dice6 className="w-4 h-4" />
        隨機分組
      </Button>
      <Button variant="destructive" onClick={() => setIsDeleting(true)}>
        <Trash2 className="w-4 h-4" />
        刪除活動
      </Button>
    </div>
  );
};
