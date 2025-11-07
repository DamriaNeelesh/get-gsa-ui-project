'use client';

import { XMarkIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";

type ChipProps = {
  label: string;
  onRemove?: () => void;
  className?: string;
};

export const Chip = ({ label, onRemove, className }: ChipProps) => {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full bg-accent-muted/60 px-3 py-1 text-sm font-medium text-accent",
        className,
      )}
    >
      <span>{label}</span>
      {onRemove ? (
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onRemove();
          }}
          className="focus-ring rounded-full p-0.5 text-accent hover:text-accent/80"
          aria-label={`Remove ${label}`}
        >
          <XMarkIcon className="h-4 w-4" aria-hidden />
        </button>
      ) : null}
    </span>
  );
};

