import { useFormContext } from "react-hook-form";
import { RichInputField } from "../ui/rich-input-field";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { DateTimePicker } from "../ui/date-time-picker";
import type { CreateEventPayload } from "~/routes/api.events.create";
import type { EditEventPayload } from "~/routes/api.events.$eventId.edit";
import { FormItem, FormLabel } from "../ui/form";
import { UserSelectInput } from "../user-select-input";
import { useFetcher } from "react-router";
import { useEffect } from "react";
import type { users } from "~/db/schema";
import { Skeleton } from "../ui/skeleton";

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
      <TeacherField />
    </>
  );
};

const TeacherField = () => {
  const form = useFormContext<CreateEventPayload | EditEventPayload>();

  const teacherIds = form.watch("teacherIds");

  return (
    <FormItem>
      <FormLabel>講師</FormLabel>
      <UserSelectInput
        onChange={(value) => {
          if (value) form.setValue("teacherIds", teacherIds.concat(value));
        }}
      />
      {teacherIds.map((teacher) => (
        <Teacher key={teacher} id={teacher} />
      ))}
    </FormItem>
  );
};

const Teacher = ({ id }: { id: number }) => {
  const fetcher = useFetcher<typeof users.$inferSelect>();

  useEffect(() => {
    fetcher.load(`/api/users/${id}`);
  }, [fetcher, id]);

  if (!fetcher.data) return <Skeleton />;

  return <div>{fetcher.data.name}</div>;
};
