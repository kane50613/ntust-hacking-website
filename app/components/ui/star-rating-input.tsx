import { StarIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "~/lib/utils";

export function StarRatingInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  const [preview, setPreview] = useState(value);

  const onMouseEnter = (value: number) => setPreview(value);

  const onMouseLeave = () => setPreview(value);

  const onClick = (value: number) => {
    setPreview(value);
    onChange(value);
  };

  return (
    <div className="flex">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          active={i < preview}
          value={i + 1}
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        />
      ))}
    </div>
  );
}

export function Star({
  active,
  value,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: {
  active: boolean;
  value: number;
  onClick?: (value: number) => void;
  onMouseEnter?: (value: number) => void;
  onMouseLeave?: () => void;
}) {
  return (
    <StarIcon
      className={cn(
        "w-6 h-6 transition-colors px-0.5",
        active ? "fill-yellow-400" : "fill-muted-foreground"
      )}
      strokeWidth={0}
      onMouseEnter={onMouseEnter?.bind(null, value)}
      onClick={onClick?.bind(null, value)}
      onMouseLeave={onMouseLeave}
    />
  );
}
