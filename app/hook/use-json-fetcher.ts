import { useCallback } from "react";
import { useFetcher } from "react-router";

type JsonValues =
  | string
  | number
  | boolean
  | null
  | JsonValues[]
  | { [key: string]: JsonValues };

export function useJsonFetcher<T extends JsonValues>(action: string) {
  const fetcher = useFetcher();

  const submit = useCallback(
    (value: T) => {
      fetcher.submit(value, {
        method: "POST",
        encType: "application/json",
        action,
      });
    },
    [action, fetcher]
  );

  return [submit, fetcher] as const;
}
