import { useFormContext } from "react-hook-form";
import { RichInputField } from "../ui/rich-input-field";
import { Input } from "../ui/input";
import type { UseInvitePayload } from "~/routes/api.invites.use";

export const UseInviteCodeFormFields = () => {
  const form = useFormContext<UseInvitePayload>();

  return (
    <>
      <RichInputField name="code" control={form.control} label="邀請碼">
        {(field) => <Input {...field} value={field.value ?? ""} />}
      </RichInputField>{" "}
    </>
  );
};
