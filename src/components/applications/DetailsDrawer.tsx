"use client";

import { Dialog, Transition } from "@headlessui/react";
import {
  ArrowPathIcon,
  CheckIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import { format, parseISO } from "date-fns";
import { Fragment, type ReactNode } from "react";

import { Button } from "@/components/ui/Button";
import type { Application, ApplicationStatus } from "@/data/applications";

type DetailsDrawerProps = {
  application: Application | null;
  open: boolean;
  onClose: () => void;
  onMarkSubmitted: (id: string) => void;
};

const STAGES: ApplicationStatus[] = [
  "Draft",
  "Ready",
  "Submitted",
  "Awarded",
  "Lost",
];

const stageIcon: Record<ApplicationStatus, ReactNode> = {
  Draft: <ArrowPathIcon className="h-5 w-5" aria-hidden />,
  Ready: <CheckIcon className="h-5 w-5" aria-hidden />,
  Submitted: <PaperAirplaneIcon className="h-5 w-5" aria-hidden />,
  Awarded: <CheckIcon className="h-5 w-5" aria-hidden />,
  Lost: <ArrowPathIcon className="h-5 w-5" aria-hidden />,
};

export const DetailsDrawer = ({
  application,
  open,
  onClose,
  onMarkSubmitted,
}: DetailsDrawerProps) => {
  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="relative z-40" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 flex justify-end">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-300"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-200"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="h-full w-full max-w-xl overflow-y-auto border-l border-neutral-200 bg-white shadow-card">
                {application ? (
                  <div className="flex h-full flex-col gap-6 p-8">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Dialog.Title className="text-2xl font-semibold text-neutral-900">
                          {application.title}
                        </Dialog.Title>
                        <p className="mt-1 text-sm text-neutral-500">
                          {application.agency} • NAICS {application.naics}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={onClose}
                        className="text-sm font-semibold text-accent hover:text-accent/80"
                      >
                        Close
                      </button>
                    </div>

                    <section className="space-y-3">
                      <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
                        Snapshot
                      </h3>
                      <p className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-sm leading-relaxed text-neutral-700">
                        {application.summary ??
                          "No summary provided. Capture manager to supply opportunity overview."}
                      </p>
                    </section>

                    <section className="space-y-3">
                      <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
                        Stage timeline
                      </h3>
                      <ol className="relative flex flex-col gap-4 border-l border-dashed border-neutral-200 pl-6">
                        {STAGES.map((stage, index) => {
                          const reached =
                            STAGES.indexOf(application.status) >= index;
                          return (
                            <li key={stage} className="relative flex items-start gap-3">
                              <span
                                className={`absolute -left-9 flex h-8 w-8 items-center justify-center rounded-full border text-accent ${
                                  reached
                                    ? "border-accent bg-accent-muted"
                                    : "border-neutral-200 bg-white text-neutral-400"
                                }`}
                              >
                                {stageIcon[stage]}
                              </span>
                              <div>
                                <p className="text-sm font-semibold text-neutral-800">
                                  {stage}
                                </p>
                                <p className="text-xs text-neutral-500">
                                  {reached
                                    ? "Milestone reached"
                                    : "Upcoming milestone"}
                                </p>
                              </div>
                            </li>
                          );
                        })}
                      </ol>
                    </section>

                    <section className="grid grid-cols-2 gap-4 text-sm">
                      <div className="rounded-xl border border-neutral-200 p-4">
                        <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                          Due date
                        </span>
                        <p className="mt-1 text-lg font-semibold text-neutral-900">
                          {format(parseISO(application.dueDate), "MMM d, yyyy")}
                        </p>
                      </div>
                      <div className="rounded-xl border border-neutral-200 p-4">
                        <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                          Ceiling
                        </span>
                        <p className="mt-1 text-lg font-semibold text-neutral-900">
                          ${application.ceiling.toLocaleString()}
                        </p>
                      </div>
                    </section>

                    <div className="mt-auto flex justify-end gap-3 border-t border-neutral-200 pt-6">
                      <Button variant="ghost" onClick={onClose}>
                        Dismiss
                      </Button>
                      <Button
                        onClick={() => onMarkSubmitted(application.id)}
                        disabled={application.status === "Submitted"}
                      >
                        {application.status === "Submitted"
                          ? "Already submitted"
                          : "Mark as Submitted"}
                      </Button>
                    </div>
                  </div>
                ) : null}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

