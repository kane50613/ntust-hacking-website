import { useRouteLoaderData } from "react-router";
import type { Info } from "~/+types/root";

export function useRootLoaderData() {
  return (
    useRouteLoaderData<Awaited<Info["loaderData"]>>("root") ?? {
      user: undefined,
    }
  );
}

export type RootLoaderData = ReturnType<typeof useRootLoaderData>;
