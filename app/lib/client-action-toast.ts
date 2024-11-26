import type { ReactNode } from "react";
import { toast } from "sonner";

interface ToastOptions {
  loading?: string | ReactNode;
  success: string | ReactNode;
  error: string | ((error: unknown) => string | ReactNode) | ReactNode;
  description?: string | ReactNode;
  finally?: () => void | Promise<void>;
}

export async function clientActionToast<Data>(
  promise: Promise<Data>,
  options: ToastOptions
) {
  const toastId = toast.loading(options.loading, {
    description: options.description,
  });

  try {
    const data = await promise;

    toast.success(options.success, {
      id: toastId,
      description: options.description,
    });

    return data;
  } catch (error) {
    if (error instanceof Response && error.status === 302) {
      toast.success(options.success, {
        id: toastId,
        description: options.description,
      });

      throw error;
    }

    const errorHandler =
      typeof options.error === "function"
        ? options.error(error)
        : options.error;

    toast.error(errorHandler, {
      id: toastId,
      description: options.description,
    });
  }
}
