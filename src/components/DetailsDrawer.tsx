'use client';

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { format } from "date-fns";

import type { Application, ApplicationStatus } from "@/data/applications";
import { Button } from "@/components/ui/Button";

type DetailsDrawerProps = {
  application: Application | null;
  onClose: () => void;
  onMarkSubmitted: (id: string) => void;
};

const STAGES: ApplicationStatus[] = ["Draft", "Ready", "Submitted", "Awarded", "Lost"];

const isStageActive = (stage: ApplicationStatus, status: ApplicationStatus) => {
  const baseStages: ApplicationStatus[] = ["Draft", "Ready", "Submitted"];
  if (stage === "Awarded") return status === "Awarded";
  if (stage === "Lost") return status === "Lost";
  const currentIndex =
    status === "Awarded" || status === "Lost"
      ? baseStages.length - 1
      : baseStages.indexOf(status);
  const stageIndex = baseStages.indexOf(stage);
  return stageIndex !== -1 && stageIndex <= currentIndex;
};

export const DetailsDrawer = ({ application, onClose, onMarkSubmitted }: DetailsDrawerProps) => {
  const activeStatus = application?.status ?? "Draft";

  const dueDate = application ? format(new Date(application.dueDate), "MMM d, yyyy") : "";

  return (
    <Transition.Root show={Boolean(application)} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
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

        <div className="fixed inset-0 flex items-end justify-end sm:items-stretch">
          <Transition.Child
            as={Fragment}
            enter="transform transition ease-out duration-200"
            enterFrom="translate-y-full sm:translate-x-full"
            enterTo="translate-y-0 sm:translate-x-0"
            leave="transform transition ease-in duration-150"
            leaveFrom="translate-y-0 sm:translate-x-0"
            leaveTo="translate-y-full sm:translate-x-full"
          >
            <Dialog.Panel className="relative flex h-[90vh] w-full max-w-xl flex-col gap-6 overflow-y-auto rounded-t-3xl border border-neutral-100 bg-white p-6 shadow-elevated sm:h-full sm:rounded-none sm:border-l">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <Dialog.Title className="text-xl font-semibold text-neutral-900">
                    {application?.title}
                  </Dialog.Title>
                  <p className="text-sm text-neutral-500">Due {dueDate}</p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="focus-ring rounded-full p-2 text-neutral-400 hover:text-neutral-600"
                  aria-label="Close details"
                >
                  <XMarkIcon className="h-5 w-5" aria-hidden />
                </button>
              </div>

              <section className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Summary</h3>
                <p className="text-sm leading-6 text-neutral-600">{application?.summary}</p>
              </section>

              <section className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Stage timeline</h3>
                <ol className="relative flex gap-3">
                  {STAGES.map((stage, index) => {
                    const isActive = application ? isStageActive(stage, activeStatus) : index === 0;
                    const isCurrent =
                      activeStatus === stage ||
                      (stage === "Submitted" && (activeStatus === "Awarded" || activeStatus === "Lost"));
                    return (
                      <li key={stage} className="flex flex-col items-center gap-2 text-xs font-medium text-neutral-500">
                        <div
                          className={clsx(
                            "flex h-9 w-9 items-center justify-center rounded-full border-2",
                            isActive
                              ? "border-accent bg-accent text-white"
                              : "border-neutral-200 bg-white text-neutral-400",
                          )}
                          aria-current={isCurrent ? "step" : undefined}
                        >
                          {isActive ? <CheckCircleIcon className="h-5 w-5" aria-hidden /> : index + 1}
                        </div>
                        <span className={clsx(isActive ? "text-neutral-700" : "text-neutral-400")}>{stage}</span>
                      </li>
                    );
                  })}
                </ol>
              </section>

              <section className="space-y-3 text-sm text-neutral-600">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Snapshot</h3>
                <dl className="grid grid-cols-2 gap-3">
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-neutral-400">Agency</dt>
                    <dd className="font-medium text-neutral-800">{application?.agency}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-neutral-400">Vehicle</dt>
                    <dd className="font-medium text-neutral-800">{application?.vehicle}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-neutral-400">NAICS</dt>
                    <dd className="font-medium text-neutral-800">{application?.naics}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-neutral-400">Ceiling</dt>
                    <dd className="font-medium text-neutral-800">
                      {application ? `$${application.ceiling.toLocaleString()}` : ""}
                    </dd>
                  </div>
                </dl>
                <div className="flex flex-wrap gap-2">
                  {application?.setAside.map((tag) => (
                    <span key={tag} className="rounded-full bg-accent-muted px-3 py-1 text-xs font-semibold text-accent">
                      {tag}
                    </span>
                  ))}
                </div>
              </section>

              <div className="mt-auto flex flex-wrap items-center gap-3 border-t border-neutral-100 pt-4">
                <Button
                  type="button"
                  onClick={() => application && onMarkSubmitted(application.id)}
                  disabled={!application || application.status === "Submitted"}
                >
                  Mark as submitted
                </Button>
                <Button type="button" variant="ghost" onClick={onClose}>
                  Close
                </Button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

