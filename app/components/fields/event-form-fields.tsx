import { useFormContext } from "react-hook-form";
import { RichInputField } from "../ui/rich-input-field";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { DateTimePicker } from "../ui/date-time-picker";
import type { CreateEventPayload } from "~/routes/api.events.create";
import type { EditEventPayload } from "~/routes/api.events.$eventId";

export const EventFormFields = () => {
  const form = useFormContext<CreateEventPayload | EditEventPayload>();

  return (
    <>
      <RichInputField name="title" control={form.control} label="標題">
        {(field) => <Input {...field} value={field.value ?? ""} />}
      </RichInputField>
      <RichInputField name="description" control={form.control} label="內文">
        {(field) => <Textarea {...field} value={field.value ?? ""} />}
      </RichInputField>
      <RichInputField name="date" control={form.control} label="日期">
        {(field) => <DateTimePicker {...field} />}
      </RichInputField>
    </>
  );
};