import type { Event } from "../card/event-card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";
import { Form } from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useJsonFetcher } from "~/hook/use-json-fetcher";
import { Submit } from "../submit";
import { RichInputField } from "../ui/rich-input-field";
import { StarRatingInput } from "../ui/star-rating-input";
import { Textarea } from "../ui/textarea";
import type { CreateFeedbackPayload } from "~/routes/api.enrolls.$enrollId.feedback";
import { createFeedbackSchema } from "~/routes/api.enrolls.$enrollId.feedback";
import { useEffect } from "react";

export const FeedbackDialog = ({
  open,
  setOpen,
  event,
  enrollId,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  event: Event;
  enrollId: number;
}) => {
  const form = useForm<CreateFeedbackPayload>({
    resolver: zodResolver(createFeedbackSchema),
  });

  const [submit, fetcher] = useJsonFetcher<CreateFeedbackPayload>(
    `/api/enrolls/${enrollId}/feedback`
  );

  useEffect(() => {
    if (fetcher.data) {
      setOpen(false);
    }
  }, [fetcher.data, setOpen]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogTitle>活動回饋</DialogTitle>
        <DialogDescription>
          請和我們分享你對「{event.title}」的想法，如果有問題請告訴我們
        </DialogDescription>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
            <RichInputField name="comment" control={form.control} label="留言">
              {(field) => <Textarea {...field} value={field.value ?? ""} />}
            </RichInputField>
            <RichInputField name="rating" control={form.control} label="評分">
              {(field) => <StarRatingInput {...field} />}
            </RichInputField>
            <Submit loading={fetcher.state !== "idle"}>送出</Submit>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
