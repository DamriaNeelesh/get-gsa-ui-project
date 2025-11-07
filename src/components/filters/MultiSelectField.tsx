'use client';

import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { Fragment } from "react";

import { Chip } from "@/components/ui/Chip";

type Option = {
  value: string;
  label: string;
};

type MultiSelectFieldProps = {
  id: string;
  label: string;
  placeholder: string;
  values: string[];
  onChange: (values: string[]) => void;
  options: Option[];
  emptyState?: string;
};

export const MultiSelectField = ({
  id,
  label,
  placeholder,
  values,
  onChange,
  options,
  emptyState = "No options",
}: MultiSelectFieldProps) => {
  const handleToggle = (value: string) => {
    if (values.includes(value)) {
      onChange(values.filter((item) => item !== value));
    } else {
      onChange([...values, value]);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-neutral-700">
        {label}
      </label>
      <Listbox value={values} onChange={onChange} multiple by="value">
        {({ open }) => (
          <div className="relative">
            <Listbox.Button
              id={id}
              className={clsx(
                "focus-ring flex w-full items-center justify-between rounded-lg border border-neutral-200 bg-white px-3 py-2 text-left text-sm shadow-sm",
                open && "border-accent ring-2 ring-accent/30",
              )}
            >
              <div className="flex flex-wrap items-center gap-1">
                {!values.length ? (
                  <span className="truncate text-neutral-400">{placeholder}</span>
                ) : null}
                {values.map((value) => (
                  <Chip
                    key={value}
                    label={options.find((option) => option.value === value)?.label ?? value}
                    onRemove={() => {
                      handleToggle(value);
                    }}
                  />
                ))}
              </div>
              <ChevronUpDownIcon className="h-4 w-4 text-neutral-400" aria-hidden />
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-20 mt-2 max-h-56 w-full overflow-auto rounded-lg border border-neutral-200 bg-white py-1 text-sm shadow-card focus:outline-none">
                {!options.length ? (
                  <div className="px-4 py-2 text-neutral-400">{emptyState}</div>
                ) : null}
                {options.map((option) => (
                  <Listbox.Option
                    key={option.value}
                    value={option.value}
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
                          {option.label}
                        </span>
                        {selected ? (
                          <CheckIcon className="h-4 w-4 text-accent" aria-hidden />
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        )}
      </Listbox>
    </div>
  );
};

