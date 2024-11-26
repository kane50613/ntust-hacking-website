import type { Info } from "~/routes/+types/_index";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { Suspense, useMemo, useState } from "react";
import { EnrollButton } from "../enroll-button";
import { useRootLoaderData } from "~/hook/useRootLoaderData";
import { Await } from "react-router";
import { EditEventDialog } from "../dialog/edit-event-dialog";
import { DeleteEventDialog } from "../dialog/delete-event-dialog";
import { SquarePen, Trash } from "lucide-react";

const dateFormatter = new Intl.DateTimeFormat("zh-TW", {
  weekday: "short",
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour12: true,
  hour: "numeric",
  minute: "numeric",
});

export type Event = Awaited<Info["loaderData"]["eventRecords"]>[number];

export const EventCard = ({ event }: { event: Event }) => {
  const { user } = useRootLoaderData();

  const parts = useMemo(() => {
    const parts = [`${event.enrollsCount} 人報名`];

    if (event.rating) {
      parts.push(`評分 ${event.rating}`);
    }

    if (event.date) {
      parts.push(dateFormatter.format(event.date));
    }

    return parts.join(" • ");
  }, [event]);

  return (
    <Card className="text-start flex flex-col bg-secondary">
      <CardHeader>
        <p className="text-sm text-muted-foreground">{parts}</p>
        <CardTitle className="text-2xl">{event.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-primary/90">{event.description}</p>
      </CardContent>
      <CardFooter className="flex gap-4 flex-wrap">
        <Suspense fallback={<EnrollButton user={undefined} event={event} />}>
          <Await resolve={user}>
            {(user) => (
              <>
                <EnrollButton user={user} event={event} />
                {user?.role === "admin" && <AdminTools event={event} />}
              </>
            )}
          </Await>
        </Suspense>
      </CardFooter>
    </Card>
  );
};

const AdminTools = ({ event }: { event: Event }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <>
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
      <Button variant="outline" onClick={() => setIsEditing(true)}>
        <SquarePen className="w-4 h-4" />
      </Button>
      <Button variant="destructive" onClick={() => setIsDeleting(true)}>
        <Trash className="w-4 h-4" />
      </Button>
    </>
  );
};

export const EventCardSkeleton = () => (
  <Card className="text-start flex flex-col w-full">
    <CardHeader>
      <Skeleton className="w-1/2">
        <p className="opacity-0 text-sm pointer-events-none">date</p>
      </Skeleton>
      <Skeleton className="w-full">
        <p className="text-2xl opacity-0 pointer-events-none">title</p>
      </Skeleton>
    </CardHeader>
    <CardContent className="flex-grow">
      <Skeleton className="w-full">
        <p className="text-sm opacity-0 pointer-events-none">description</p>
      </Skeleton>
    </CardContent>
    <CardFooter>
      <Skeleton>
        <Button
          disabled
          className="bg-transparent text-transparent pointer-events-none"
        >
          立刻報名
        </Button>
      </Skeleton>
    </CardFooter>
  </Card>
);
