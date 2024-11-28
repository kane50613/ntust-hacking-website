import type { ColumnDef } from "@tanstack/react-table";
import type { AdminEvent } from "~/routes/admin.events.$eventId";
import { Star } from "../ui/star-rating-input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { MessageCircleIcon } from "lucide-react";

  const dateFormatter = new Intl.DateTimeFormat("zh-TW", {
    dateStyle: "full",
    timeStyle : "short",
  });

export const columns: ColumnDef<AdminEvent["enrolls"][number]>[] = [
  {
    accessorKey: "user.name",
    header: "社員",
  },
  {
    id: "feedback",
    header: "回饋",
    cell({ row }) {
      return (
        <div className="flex gap-2">
          <Rating rating={row.original.feedback?.rating} />
          {row.original.feedback?.comment && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <MessageCircleIcon className="w-4 h-4" />
                </TooltipTrigger>
                <TooltipContent>{row.original.feedback.comment}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      );
    },
  },
  {
    accessorFn: ({ createdAt }) => dateFormatter.format(createdAt),
    header: "日期",
  }
];

const Rating = ({ rating }: { rating?: number }) => {
  if (rating === undefined) return "無評分";

  return (
    <div className="flex">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} active={i < rating} value={i + 1} />
      ))}
    </div>
  );
};
