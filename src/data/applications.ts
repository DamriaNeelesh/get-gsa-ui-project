export type ApplicationStatus = "Draft" | "Ready" | "Submitted" | "Awarded" | "Lost";

export type Application = {
  id: string;
  title: string;
  agency: string;
  naics: string;
  setAside: string[];
  vehicle: string;
  dueDate: string;
  status: ApplicationStatus;
  percentComplete: number;
  fitScore: number;
  ceiling: number;
  keywords: string[];
  summary?: string;
};

export const applications: Application[] = [
  {
    id: "RFP-001",
    title: "Network Modernization for Regional Offices",
    agency: "GSA",
    naics: "541512",
    setAside: ["8(a)", "WOSB"],
    vehicle: "GSA MAS",
    dueDate: "2025-10-30",
    status: "Draft",
    percentComplete: 35,
    fitScore: 78,
    ceiling: 2_500_000,
    keywords: ["network", "modernization"],
    summary:
      "Modernize regional office infrastructure with secure, redundant networking fabric and zero-downtime migration plan.",
  },
  {
    id: "RFP-002",
    title: "Cloud Migration and Security Hardening",
    agency: "USDA",
    naics: "541519",
    setAside: ["SB"],
    vehicle: "Alliant 2",
    dueDate: "2025-11-12",
    status: "Ready",
    percentComplete: 60,
    fitScore: 84,
    ceiling: 4_800_000,
    keywords: ["cloud", "security", "migration"],
    summary:
      "Enterprise data center exit effort migrating legacy workloads into FedRAMP High cloud landing zones with hardened baselines.",
  },
  {
    id: "RFP-003",
    title: "AI-enabled Help Desk Pilot",
    agency: "DOE",
    naics: "541511",
    setAside: ["SDVOSB"],
    vehicle: "GSA MAS",
    dueDate: "2025-10-20",
    status: "Submitted",
    percentComplete: 100,
    fitScore: 71,
    ceiling: 900_000,
    keywords: ["AI", "help desk"],
    summary:
      "Pilot intelligent ticket triage with multi-channel intake, knowledge graph integration, and agent assist capabilities.",
  },
  {
    id: "RFP-004",
    title: "Data Warehouse Optimization",
    agency: "HHS",
    naics: "541512",
    setAside: ["SB", "HUBZone"],
    vehicle: "CIO-SP3",
    dueDate: "2025-11-05",
    status: "Ready",
    percentComplete: 75,
    fitScore: 88,
    ceiling: 3_200_000,
    keywords: ["data", "warehouse", "optimization"],
    summary:
      "Consolidate fragmented data marts, improve ELT pipelines, and deploy adaptive governance for cross-agency analytics.",
  },
  {
    id: "RFP-005",
    title: "Contact Center Modernization",
    agency: "VA",
    naics: "517311",
    setAside: ["VOSB"],
    vehicle: "GSA MAS",
    dueDate: "2025-10-25",
    status: "Draft",
    percentComplete: 20,
    fitScore: 65,
    ceiling: 1_500_000,
    keywords: ["contact center", "telephony"],
    summary:
      "Replace legacy telephony, integrate CRM tooling, and deploy omnichannel self-service features for veteran outreach.",
  },
  {
    id: "RFP-006",
    title: "Zero Trust Architecture Pilot",
    agency: "DHS",
    naics: "541513",
    setAside: ["SB"],
    vehicle: "Alliant 2",
    dueDate: "2025-12-01",
    status: "Draft",
    percentComplete: 10,
    fitScore: 82,
    ceiling: 5_200_000,
    keywords: ["zero trust", "ztaa", "security"],
    summary:
      "Design and implement zero trust reference architecture with continuous verification and adaptive access policies.",
  },
  {
    id: "RFP-007",
    title: "SaaS Licensing & Optimization",
    agency: "DOC",
    naics: "541519",
    setAside: ["WOSB"],
    vehicle: "GSA MAS",
    dueDate: "2025-10-18",
    status: "Awarded",
    percentComplete: 100,
    fitScore: 69,
    ceiling: 600_000,
    keywords: ["saas", "finops"],
    summary:
      "Centralize SaaS spend management with catalog rationalization, usage telemetry, and savings benchmarks.",
  },
  {
    id: "RFP-008",
    title: "Unified Endpoint Management",
    agency: "DOD",
    naics: "541512",
    setAside: ["SB"],
    vehicle: "CIO-SP3",
    dueDate: "2025-11-20",
    status: "Lost",
    percentComplete: 100,
    fitScore: 61,
    ceiling: 4_100_000,
    keywords: ["uems", "device"],
    summary:
      "Deploy unified endpoint security and compliance tooling with automated posture remediation and reporting dashboards.",
  },
  {
    id: "RFP-009",
    title: "Geospatial Analytics Platform",
    agency: "NOAA",
    naics: "541511",
    setAside: ["HUBZone"],
    vehicle: "GSA MAS",
    dueDate: "2025-10-28",
    status: "Ready",
    percentComplete: 70,
    fitScore: 86,
    ceiling: 2_800_000,
    keywords: ["geospatial", "gis"],
    summary:
      "Build cloud-native geospatial platform enabling near-real-time analytics, visualization, and data sharing.",
  },
  {
    id: "RFP-010",
    title: "Identity & Access Modernization",
    agency: "SSA",
    naics: "541512",
    setAside: ["SB", "8(a)"],
    vehicle: "Alliant 2",
    dueDate: "2025-11-08",
    status: "Submitted",
    percentComplete: 100,
    fitScore: 79,
    ceiling: 3_600_000,
    keywords: ["iam", "identity", "sso"],
    summary:
      "Modernize IAM stack with passwordless authentication, lifecycle automation, and FedRAMP-compliant governance.",
  },
];

export const STATUSES: ApplicationStatus[] = [
  "Draft",
  "Ready",
  "Submitted",
  "Awarded",
  "Lost",
];

