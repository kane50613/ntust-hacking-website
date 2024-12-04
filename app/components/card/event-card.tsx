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
import { Suspense, useMemo } from "react";
import { EnrollButton } from "../enroll-button";
import { useRootLoaderData } from "~/hook/useRootLoaderData";
import { Await, Link } from "react-router";
import { Settings } from "lucide-react";

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
                {user?.role === "admin" && (
                  <Button asChild variant="outline">
                    <Link to={`/admin/events/${event.eventId}`}>
                      <Settings className="w-4 h-4" />
                    </Link>
                  </Button>
                )}
              </>
            )}
          </Await>
        </Suspense>
      </CardFooter>
    </Card>
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
