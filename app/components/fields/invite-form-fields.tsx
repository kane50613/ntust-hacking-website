import { useFormContext } from "react-hook-form";
import type { CreateInvitePayload } from "~/routes/api.invites.create";
import { RichInputField } from "../ui/rich-input-field";
import { Input } from "../ui/input";
import type { EditInvitePayload } from "~/routes/api.invites.$inviteId.edit";

export const InviteFormFields = () => {
  const form = useFormContext<CreateInvitePayload | EditInvitePayload>();

  return (
    <>
      <RichInputField
        name="code"
        control={form.control}
        label="邀請碼"
        description="如未填寫預設生成隨機六位數字"
      >
        {(field) => <Input {...field} value={field.value ?? ""} />}
      </RichInputField>
      <RichInputField
        name="maxUsages"
        control={form.control}
        label="最大使用次數"
        description="預設為一次"
      >
        {(field) => (
          <Input
            {...field}
            onChange={(event) => {
              if (!event.target.value) return field.onChange();

              return field.onChange(Number(event.target.value));
            }}
            value={field.value ?? ""}
          />
        )}
      </RichInputField>
    </>
  );
};
