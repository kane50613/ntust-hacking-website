import { Info } from "~/routes/+types/index";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { useMemo } from "react";

const dateFormatter = new Intl.DateTimeFormat("zh-TW", {
  dateStyle: "full",
  timeStyle: "short",
});

export const EventCard = ({
  event,
}: {
  event: Awaited<Info["loaderData"]["eventRecords"]>[number];
}) => {
  const parts = useMemo(() => {
    const parts = [`${event.enrolls} 人`];

    if (event.date) {
      parts.push(dateFormatter.format(event.date));
    }

    return parts.join(" • ");
  }, [event]);

  return (
    <Card className="text-start flex flex-col">
      <CardHeader>
        <p className="text-sm text-muted-foreground">{parts}</p>
        <CardTitle className="text-2xl">{event.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-primary/90">{event.description}</p>
      </CardContent>
      <CardFooter>
        <Button>立刻報名</Button>
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
