import { useState } from "react";
import { SignInDialog } from "./dialog/sign-in-dialog";
import { Button } from "./ui/button";
import { Event } from "./card/event-card";
import { RootLoaderData } from "~/hook/useRootLoaderData";
import { useJsonFetcher } from "~/hook/use-json-fetcher";
import { EnrollPayload } from "~/routes/enroll";

export const EnrollButton = ({
  event,
  user,
}: {
  event: Event;
  user: Awaited<RootLoaderData["user"]>;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const [submit, fetcher] = useJsonFetcher<EnrollPayload>("/enroll");

  return (
    <>
      <SignInDialog open={isOpen} setOpen={setIsOpen} />
      {event.enrolls?.length ? (
        <EnrolledButton />
      ) : (
        <Button
          disabled={fetcher.state !== "idle"}
          onClick={() => {
            if (!user) return setIsOpen(true);

            submit({
              eventId: event.eventId,
            });
          }}
        >
          立刻報名
        </Button>
      )}
    </>
  );
};

const EnrolledButton = () => (
  <Button disabled variant="outline">
    報名成功
  </Button>
);
