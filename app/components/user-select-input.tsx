import { useFetcher } from "react-router";
import type { users } from "~/db/schema";
import { useDeferredValue, useEffect, useState } from "react";
import { AutoComplete } from "./ui/autocomplete";

interface UserSelectInputProps {
  value?: number;
  onChange: (value: number) => void;
}

export function UserSelectInput({ value, onChange }: UserSelectInputProps) {
  const [search, setSearch] = useState("");

  const deferredSearch = useDeferredValue(search);

  const { load, data, state } = useFetcher<(typeof users.$inferSelect)[]>({
    key: `users-search-${deferredSearch}`,
  });

  useEffect(() => {
    if (!deferredSearch) return;

    const url = new URL("/api/users", location.origin);

    url.searchParams.set("query", deferredSearch);

    load(url.pathname + url.search);
  }, [load, deferredSearch]);

  return (
    <AutoComplete
      items={
        data?.map((user) => ({
          label: user.name,
          value: user.userId.toString(),
        })) ?? []
      }
      isLoading={state !== "idle"}
      selectedValue={value ? value.toString() : ""}
      onSelectedValueChange={(value) => onChange(parseInt(value))}
      searchValue={search}
      onSearchValueChange={setSearch}
    />
  );
}
