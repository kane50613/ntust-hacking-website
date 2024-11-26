import { useCallback } from "react";
import { useFetcher } from "react-router";
import { stringify } from "devalue";

export function useJsonFetcher<T>(action: string) {
  const fetcher = useFetcher();

  const submit = useCallback(
    (value: T) => {
      fetcher.submit(stringify(value), {
        method: "POST",
        encType: "application/json",
        action,
      });
    },
    [action, fetcher]
  );

  return [submit, fetcher] as const;
}
