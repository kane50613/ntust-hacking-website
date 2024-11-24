import { Info } from "~/routes/+types/index";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";

const dateFormatter = new Intl.DateTimeFormat("zh-TW", {
  dateStyle: "full",
  timeStyle: "short",
});

export const EventCard = ({
  event,
}: {
  event: Awaited<Info["loaderData"]["eventRecords"]>[number];
}) => {
  return (
    <Card className="text-start flex flex-col">
      <CardHeader>
        {event.date && (
          <p className="text-sm text-muted-foreground">
            {dateFormatter.format(event.date)}
          </p>
        )}
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
