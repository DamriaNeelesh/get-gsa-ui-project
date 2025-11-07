import type { Metadata } from "next";
import { Suspense } from "react";

import { HomeClient } from "@/components/HomeClient";

export const metadata: Metadata = {
  title: "GSA Opportunity Explorer",
  description:
    "Filter, track, and monitor federal opportunities with responsive dashboards and applied search criteria.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "GSA Opportunity Explorer",
    description:
      "Collect criteria, analyse opportunity fit, and monitor progress in a single responsive workspace.",
    type: "website",
  },
};

export default function Home() {
  return (
    <Suspense
      fallback={
        <main
          className="flex min-h-screen items-center justify-center bg-neutral-50"
          aria-busy="true"
          aria-live="polite"
        >
          <span className="text-sm font-medium text-neutral-500">Loading workspace…</span>
        </main>
      }
    >
      <HomeClient />
    </Suspense>
  );
}

