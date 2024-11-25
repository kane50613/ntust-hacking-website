import { useRouteLoaderData } from "react-router";
import { Info } from "~/+types/root";

export function useRootLoaderData() {
  return useRouteLoaderData<Awaited<Info["loaderData"]>>("root") ?? {};
}

export type RootLoaderData = ReturnType<typeof useRootLoaderData>;
