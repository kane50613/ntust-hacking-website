import { useFetcher } from "react-router";
import type { users } from "~/db/schema";
import { useEffect, useState } from "react";
import { AutoComplete } from "./ui/autocomplete";

interface UserSelectInputProps {
  value?: number;
  onChange: (value: number) => void;
}

export function UserSelectInput({ value, onChange }: UserSelectInputProps) {
  const [search, setSearch] = useState("");

  const { load, data, state } = useFetcher<(typeof users.$inferSelect)[]>();

  useEffect(() => {
    if (!search) return;

    const url = new URL("/api/users", location.origin);

    url.searchParams.set("query", search);

    load(url.pathname + url.search);
  }, [load, search]);

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
