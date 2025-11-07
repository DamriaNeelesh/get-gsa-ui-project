'use client';

import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { Fragment, useMemo, useState } from "react";

import { Chip } from "@/components/ui/Chip";

type AgencyComboboxProps = {
  id: string;
  label: string;
  options: string[];
  values: string[];
  onChange: (agencies: string[]) => void;
};

export const AgencyCombobox = ({
  id,
  label,
  options,
  values,
  onChange,
}: AgencyComboboxProps) => {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return options;
    return options.filter((option) =>
      option.toLowerCase().includes(query.trim().toLowerCase()),
    );
  }, [options, query]);

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-neutral-700">
        {label}
      </label>
      <Combobox value={values} onChange={onChange} multiple>
        {({ open }) => (
          <div className="relative">
            <div className="flex items-center gap-1">
              <Combobox.Button className="flex-1">
                <Combobox.Input
                  id={id}
                  displayValue={() => ""}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Filter agencies"
                  className={clsx(
                    "focus-ring w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm shadow-sm",
                    open && "border-accent ring-2 ring-accent/30",
                  )}
                  onKeyDown={(event) => {
                    if (event.key === "Backspace" && !query && values.length) {
                      event.preventDefault();
                      const next = [...values];
                      next.pop();
                      onChange(next);
                    }
                  }}
                />
              </Combobox.Button>
              <ChevronUpDownIcon className="h-4 w-4 text-neutral-400" aria-hidden />
            </div>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              afterLeave={() => setQuery("")}
            >
              <Combobox.Options className="absolute z-30 mt-2 max-h-56 w-full overflow-auto rounded-lg border border-neutral-200 bg-white py-1 text-sm shadow-card">
                {!filtered.length ? (
                  <div className="px-4 py-2 text-neutral-400">
                    {query ? "No agencies match" : "No agencies available"}
                  </div>
                ) : null}
                {filtered.map((option) => (
                  <Combobox.Option
                    key={option}
                    value={option}
                    className={({ active }) =>
                      clsx(
                        "flex cursor-pointer items-center justify-between px-4 py-2",
                        active ? "bg-accent-muted text-neutral-900" : "text-neutral-700",
                      )
                    }
                  >
                    {({ selected }) => (
                      <>
                        <span className={selected ? "font-semibold" : "font-medium"}>
                          {option}
                        </span>
                        {selected ? (
                          <CheckIcon className="h-4 w-4 text-accent" aria-hidden />
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))}
              </Combobox.Options>
            </Transition>
          </div>
        )}
      </Combobox>
      {values.length ? (
        <div className="flex flex-wrap gap-1">
          {values.map((agency) => (
            <Chip
              key={agency}
              label={agency}
              onRemove={() =>
                onChange(values.filter((candidate) => candidate !== agency))
              }
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};

