import { useState } from "react";
import { CreateEventDialog } from "../dialog/create-event-dialog";
import { Card } from "../ui/card";

export const CreateEventCard = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <CreateEventDialog open={isOpen} setOpen={setIsOpen} />
      <button onClick={() => setIsOpen(true)}>
        <Card className="flex p-6 h-full items-center hover:bg-secondary/50 transition-colors">
          <div className="flex flex-col text-start">
            <p className="text-2xl mb-1">準備好開始新的挑戰了嗎？</p>
            <p className="text-muted-foreground">建立新活動</p>
          </div>
        </Card>
      </button>
    </>
  );
};
