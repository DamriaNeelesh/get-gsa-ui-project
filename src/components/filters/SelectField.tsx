'use client';

import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon, XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { Fragment } from "react";

export type Option = {
  value: string;
  label: string;
  description?: string;
};

type SelectFieldProps = {
  id: string;
  label: string;
  placeholder: string;
  value: string | null;
  onChange: (value: string | null) => void;
  options: Option[];
  helperText?: string;
};

export const SelectField = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  options,
  helperText,
}: SelectFieldProps) => {
  const activeOption = options.find((option) => option.value === value);

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-neutral-700">
        {label}
      </label>
      <Listbox value={value} onChange={onChange} by="value">
        {({ open }) => (
          <div className="relative">
            <Listbox.Button
              id={id}
              className={clsx(
                "focus-ring flex w-full items-center justify-between rounded-lg border border-neutral-200 bg-white px-3 py-2 text-left text-sm shadow-sm",
                open && "border-accent ring-2 ring-accent/30",
              )}
            >
              <span className="truncate text-neutral-900">
                {activeOption ? activeOption.label : placeholder}
              </span>
              <span className="flex items-center gap-2">
                {value ? (
                  <button
                    type="button"
                    aria-label="Clear selection"
                    onClick={(event) => {
                      event.stopPropagation();
                      onChange(null);
                    }}
                    className="rounded-full p-1 text-neutral-400 hover:text-neutral-600"
                  >
                    <XMarkIcon className="h-4 w-4" aria-hidden />
                  </button>
                ) : null}
                <ChevronUpDownIcon className="h-4 w-4 text-neutral-400" aria-hidden />
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-20 mt-2 max-h-56 w-full overflow-auto rounded-lg border border-neutral-200 bg-white py-1 text-sm shadow-card focus:outline-none">
                {!options.length ? (
                  <div className="px-4 py-2 text-neutral-400">No options</div>
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
                        <div className="flex flex-col">
                          <span className={selected ? "font-semibold" : "font-medium"}>
                            {option.label}
                          </span>
                          {option.description ? (
                            <span className="text-xs text-neutral-500">{option.description}</span>
                          ) : null}
                        </div>
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
      {helperText ? <p className="text-xs text-neutral-500">{helperText}</p> : null}
    </div>
  );
};

