import { useState } from "react";
import { SignInDialog } from "./dialog/sign-in-dialog";
import { Button } from "./ui/button";
import type { Event } from "./card/event-card";
import type { RootLoaderData } from "~/hook/useRootLoaderData";
import { useJsonFetcher } from "~/hook/use-json-fetcher";
import type { EnrollPayload } from "~/routes/enroll";
import { FeedbackDialog } from "./dialog/feedback-dialog";

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
      {event.enrollId ? (
        <EnrolledButton event={event} enrollId={event.enrollId} />
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

const EnrolledButton = ({
  event,
  enrollId,
}: {
  event: Event;
  enrollId: number;
}) => {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  return (
    <>
      <FeedbackDialog
        open={isFeedbackOpen}
        setOpen={setIsFeedbackOpen}
        event={event}
        enrollId={enrollId}
      />
      <Button disabled variant="outline">
        報名成功
      </Button>
      <Button
        disabled={!!event.feedback}
        onClick={() => setIsFeedbackOpen(true)}
      >
        填寫回饋
      </Button>
    </>
  );
};
