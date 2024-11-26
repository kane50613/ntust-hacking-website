import { Loader2 } from "lucide-react";
import { Button, type ButtonProps } from "~/components/ui/button";

export function Submit({
  loading,
  ...props
}: ButtonProps & {
  loading?: boolean;
}) {
  return (
    <Button disabled={loading} type="submit" {...props}>
      {loading ? (
        <Loader2 className="w-4 animate-spin" />
      ) : (
        props.children ?? "送出"
      )}
    </Button>
  );
}
