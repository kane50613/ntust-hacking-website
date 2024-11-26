import { Suspense, useState } from "react";
import { EventCard, EventCardSkeleton } from "../card/event-card";
import { SectionTitle } from "../section-title";
import type { Info } from "~/routes/+types/_index";
import { Await } from "react-router";
import { AsyncError } from "../async-error";
import { cn } from "~/lib/utils";
import { ChevronDown } from "lucide-react";
import { useRootLoaderData } from "~/hook/useRootLoaderData";
import { CreateEventCard } from "../card/create-event-card";

export const Events = ({
  eventRecords,
}: {
  eventRecords: Info["loaderData"]["eventRecords"];
}) => {
  const [showFull, setShowFull] = useState(false);
  const { user } = useRootLoaderData();

  return (
    <div
      className="flex flex-col items-center justify-center gap-12 text-center py-16 container"
      id="events"
    >
      <SectionTitle>社團課資訊</SectionTitle>
      <div
        className={cn(
          "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full relative",
          !showFull && "h-96 overflow-y-hidden"
        )}
      >
        <Suspense>
          <Await resolve={user}>
            {(user) => (user?.role === "admin" ? <CreateEventCard /> : null)}
          </Await>
        </Suspense>
        <Suspense
          fallback={Array.from({ length: 5 }, (_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        >
          <Await resolve={eventRecords} errorElement={<AsyncError />}>
            {(records) =>
              records.map((eventRecord) => (
                <EventCard key={eventRecord.eventId} event={eventRecord} />
              ))
            }
          </Await>
        </Suspense>
        {!showFull && (
          <button
            className="w-full bg-gradient-to-b from-transparent to-background to-60% absolute bottom-0 left-0 h-24 flex justify-center z-10 items-center"
            onClick={() => setShowFull(true)}
          >
            顯示更多資訊 <ChevronDown className="w-4 ml-2" />
          </button>
        )}
      </div>
    </div>
  );
};
