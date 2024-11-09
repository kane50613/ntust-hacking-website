import { useAsyncError } from "react-router";

export const AsyncError = () => {
  const error = useAsyncError();

  return <div>Error: {error instanceof Error ? error.message : String(error)}</div>;
};
