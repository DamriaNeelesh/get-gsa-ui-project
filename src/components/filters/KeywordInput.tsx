'use client';

import { useState } from "react";

import { Chip } from "@/components/ui/Chip";

type KeywordInputProps = {
  values: string[];
  onChange: (keywords: string[]) => void;
};

const normalise = (value: string) => value.trim().toLowerCase();

export const KeywordInput = ({ values, onChange }: KeywordInputProps) => {
  const [inputValue, setInputValue] = useState("");

  const commitKeyword = (value: string) => {
    const cleaned = normalise(value);
    if (!cleaned) return;
    if (values.includes(cleaned)) {
      setInputValue("");
      return;
    }
    onChange([...values, cleaned]);
    setInputValue("");
  };

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="keyword-input" className="text-sm font-medium text-neutral-700">
        Keywords
      </label>
      <div className="rounded-lg border border-neutral-200 bg-white px-3 py-2 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {values.map((keyword) => (
            <Chip
              key={keyword}
              label={keyword}
              onRemove={() => onChange(values.filter((item) => item !== keyword))}
            />
          ))}
          <input
            id="keyword-input"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onBlur={() => commitKeyword(inputValue)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                commitKeyword(inputValue);
              }
              if (event.key === "Backspace" && !inputValue && values.length) {
                onChange(values.slice(0, -1));
              }
            }}
            placeholder="Add keyword and press Enter"
            className="min-w-[8rem] flex-1 border-none bg-transparent text-sm outline-none placeholder:text-neutral-400"
            aria-describedby="keyword-helper"
          />
        </div>
      </div>
      <p id="keyword-helper" className="text-xs text-neutral-500">
        Keywords match against titles and metadata. Duplicates are ignored automatically.
      </p>
    </div>
  );
};

