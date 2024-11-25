import { Suspense } from "react";
import { EventCard, EventCardSkeleton } from "../event-card";
import { SectionTitle } from "../section-title";
import { Info } from "~/routes/+types/_index";
import { Await } from "react-router";
import { AsyncError } from "../async-error";

export const Events = ({
  eventRecords,
}: {
  eventRecords: Info["loaderData"]["eventRecords"];
}) => {
  return (
    <div
      className="flex flex-col items-center justify-center gap-12 text-center py-16 container"
      id="events"
    >
      <SectionTitle>社團課資訊</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
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
      </div>
    </div>
  );
};
