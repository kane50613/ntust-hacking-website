import { useFormContext } from "react-hook-form";
import { RichInputField } from "../ui/rich-input-field";
import { Input } from "../ui/input";
import type { CreateGroupingPayload } from "~/routes/api.events.$eventId.create-grouping";

export const EventGroupingFormFields = () => {
  const form = useFormContext<CreateGroupingPayload>();

  return (
    <>
      <RichInputField name="amount" control={form.control} label="組數">
        {(field) => (
          <Input
            {...field}
            onChange={(e) => field.onChange(Number(e.target.value || 0))}
          />
        )}
      </RichInputField>
    </>
  );
};
