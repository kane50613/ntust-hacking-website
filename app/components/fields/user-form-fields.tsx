import { useFormContext } from "react-hook-form";
import { RichInputField } from "../ui/rich-input-field";
import { Input } from "../ui/input";
import type { EditUserPayload } from "~/routes/api.users.$userId.edit";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { roles } from "~/db/schema";

export const UserFormFields = () => {
  const form = useFormContext<EditUserPayload>();

  return (
    <>
      <RichInputField name="name" control={form.control} label="姓名">
        {(field) => <Input {...field} value={field.value ?? ""} />}
      </RichInputField>
      <RichInputField name="email" control={form.control} label="電子郵件">
        {(field) => <Input {...field} value={field.value ?? ""} />}
      </RichInputField>
      <RichInputField name="role" control={form.control} label="權限">
        {(field) => (
          <Select {...field} onValueChange={field.onChange}>
            <SelectTrigger>
              <SelectValue placeholder="選擇權限" />
            </SelectTrigger>
            <SelectContent>
              {roles.enumValues.map((value) => (
                <SelectItem key={value} value={value}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </RichInputField>
    </>
  );
};
