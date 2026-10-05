// Central demo dataset — used when DATABASE_URL is missing so the UI never looks empty.
// Shape mirrors the Drizzle schema; swap to real DB by setting DATABASE_URL + running seed.
export const DEMO_ORG = { id: "org-apex", name: "Apex Manufacturing Ltd.", industry: "Manufacturing", size: "51-200" };
export const DEMO_ORGS = [
  DEMO_ORG,
  { id: "org-meridian", name: "Meridian Audit Partners", industry: "Audit & Assurance", size: "11-50" },
];

export const DEMO_USER = { id: "u-henkyaa", name: "Henkyaa Japheth", email: "henkyaa@apex.example", role: "admin", org: "Apex Manufacturing Ltd." };

export const DEMO_PEOPLE = [
  { id: "u-sarah", name: "Sarah Okafor", role: "Finance Manager", org: "Apex Manufacturing Ltd.", type: "INTERNAL", email: "sarah@apex.example" },
  { id: "u-daniel", name: "Daniel Ibrahim", role: "Internal Auditor", org: "Apex Manufacturing Ltd.", type: "INTERNAL", email: "daniel@apex.example" },
  { id: "u-henkyaa", name: "Henkyaa Japheth", role: "Admin", org: "Apex Manufacturing Ltd.", type: "INTERNAL", email: "henkyaa@apex.example" },
  { id: "u-michael", name: "Michael Adeyemi", role: "External Auditor", org: "Meridian Audit Partners", type: "EXTERNAL", email: "michael@meridian.example" },
  { id: "u-jane", name: "Jane Williams", role: "Engagement Partner", org: "Meridian Audit Partners", type: "EXTERNAL", email: "jane@meridian.example" },
];

export const DEMO_ENGAGEMENTS = [
  { id: "eng-2026", title: "2026 External Audit", org: "Apex Manufacturing Ltd.", firm: "Meridian Audit Partners", progress: 78, done: 23, total: 29, due: "30 Sept 2026", status: "active", period: "01 Jan — 30 Sept 2026", desc: "Statutory external audit for FY2026. Evidence, requests and approvals live here." },
  { id: "eng-2025", title: "2025 Financial Audit", org: "Apex Manufacturing Ltd.", firm: "Meridian Audit Partners", progress: 100, done: 31, total: 31, due: "28 Feb 2026", status: "completed", period: "01 Jan — 31 Dec 2025", desc: "Prior year statutory audit. Archived." },
  { id: "eng-controls", title: "Internal Controls Review", org: "Apex Manufacturing Ltd.", firm: "Internal", progress: 45, done: 9, total: 20, due: "15 Nov 2026", status: "active", period: "Ongoing", desc: "SOX-like controls walkthrough." },
  { id: "eng-tax", title: "Tax Compliance Review", org: "Apex Manufacturing Ltd.", firm: "Meridian Audit Partners", progress: 20, done: 2, total: 10, due: "30 June 2027", status: "active", period: "FY2026", desc: "Corporate tax evidence pack." },
  { id: "eng-north", title: "Due Diligence — Project North", org: "Apex Manufacturing Ltd.", firm: "Meridian Audit Partners", progress: 62, done: 8, total: 13, due: "12 Dec 2026", status: "active", period: "Q4 2026", desc: "Buy-side diligence workstream." },
];

export const DEMO_REQUESTS = [
  { id: "req-01", code: "REQ-023", title: "Bank statements — Jan–Sep 2026", from: "ABC Finance", assignee: "Sarah Okafor", status: "submitted", due: "20 Sept 2026", priority: "high", category: "Bank statements", engagement: "2026 External Audit", desc: "Full monthly statements including September close." },
  { id: "req-02", code: "REQ-024", title: "Supplier invoices — Q3 2026", from: "Procurement", assignee: "Sarah Okafor", status: "under_review", due: "22 Sept 2026", priority: "medium", category: "Invoices", engagement: "2026 External Audit", desc: "All supplier invoices > ₦500k." },
  { id: "req-03", code: "REQ-025", title: "Payroll summary — September", from: "HR & Payroll", assignee: "Daniel Ibrahim", status: "approved", due: "18 Sept 2026", priority: "medium", category: "Payroll", engagement: "2026 External Audit", desc: "PAYE, pension schedules." },
  { id: "req-04", code: "REQ-026", title: "Bank reconciliation evidence", from: "Finance", assignee: "Sarah Okafor", status: "overdue", due: "2 days overdue", priority: "urgent", category: "Bank statements", engagement: "2026 External Audit", desc: "Reconciliation with outstanding items." },
  { id: "req-05", code: "REQ-027", title: "Fixed asset register", from: "Finance", assignee: "Daniel Ibrahim", status: "pending", due: "05 Oct 2026", priority: "low", category: "Contracts", engagement: "2026 External Audit", desc: "Additions/disposals schedule." },
  { id: "req-06", code: "REQ-028", title: "Board resolution — dividend", from: "Company Secretariat", assignee: "Jane Williams", status: "completed", due: "10 Sept 2026", priority: "medium", category: "Contracts", engagement: "2026 External Audit", desc: "Signed board minutes." },
  { id: "req-07", code: "REQ-029", title: "Accounts receivable ageing", from: "Finance", assignee: "Sarah Okafor", status: "changes_requested", due: "25 Sept 2026", priority: "high", category: "Invoices", engagement: "2026 External Audit", desc: "Ageing + provision memo." },
];

export const DEMO_DOCS = [
  { id: "doc-1", code: "DOC-8F29", title: "Bank Statement — September 2026", by: "Sarah Okafor", date: "Sep 14, 2026", version: 2, reviewed: true, approved: true, category: "Bank statements", engagement: "2026 External Audit", size: "2.4 MB" },
  { id: "doc-2", code: "DOC-91A0", title: "Supplier Invoices — Q3 Pack", by: "Sarah Okafor", date: "Sep 12, 2026", version: 1, reviewed: true, approved: false, category: "Invoices", engagement: "2026 External Audit", size: "18 MB" },
  { id: "doc-3", code: "DOC-77BC", title: "Payroll Summary — September", by: "Daniel Ibrahim", date: "Sep 10, 2026", version: 3, reviewed: true, approved: true, category: "Payroll", engagement: "2026 External Audit", size: "1.1 MB" },
  { id: "doc-4", code: "DOC-55E1", title: "Tax Payment Evidence — CIT Q2", by: "Sarah Okafor", date: "Sep 08, 2026", version: 1, reviewed: false, approved: false, category: "Tax", engagement: "Tax Compliance Review", size: "860 KB" },
  { id: "doc-5", code: "DOC-40D2", title: "Fixed Asset Register FY2026", by: "Daniel Ibrahim", date: "Sep 05, 2026", version: 1, reviewed: false, approved: false, category: "Contracts", engagement: "2026 External Audit", size: "3.2 MB" },
  { id: "doc-6", code: "DOC-22F9", title: "Board Resolution — Dividend", by: "Jane Williams", date: "Sep 02, 2026", version: 1, reviewed: true, approved: true, category: "Contracts", engagement: "2026 External Audit", size: "420 KB" },
  { id: "doc-7", code: "DOC-18C4", title: "Accounts Receivable Report", by: "Sarah Okafor", date: "Aug 30, 2026", version: 2, reviewed: true, approved: false, category: "Invoices", engagement: "2026 External Audit", size: "1.8 MB" },
];

export const DEMO_ACTIVITY = [
  { id: "ev-1", time: "10:42:31", ago: "2 min ago", actor: "Sarah Okafor", org: "Apex Manufacturing Ltd.", action: "UPLOADED", target: "Bank Statement — September 2026", meta: "Document ID: DOC-8F29 · v2", engagement: "2026 External Audit" },
  { id: "ev-2", time: "10:48:03", ago: "18 min ago", actor: "Michael Adeyemi", org: "Meridian Audit Partners", action: "VIEWED", target: "Bank Statement — September 2026", meta: "IP 102.89.x.x · Lagos", engagement: "2026 External Audit" },
  { id: "ev-3", time: "11:06:44", ago: "42 min ago", actor: "Michael Adeyemi", org: "Meridian Audit Partners", action: "REQUESTED CHANGES", target: "Bank Statement — September 2026", meta: "Reason: Missing page 4", engagement: "2026 External Audit" },
  { id: "ev-4", time: "11:21:12", ago: "1 hr ago", actor: "Sarah Okafor", org: "Apex Manufacturing Ltd.", action: "UPLOADED NEW VERSION", target: "Bank Statement — September 2026 · Version 2", meta: "SHA 9f2c…a1 · hash-chained", engagement: "2026 External Audit" },
  { id: "ev-5", time: "11:34:51", ago: "2 hrs ago", actor: "Michael Adeyemi", org: "Meridian Audit Partners", action: "APPROVED", target: "Bank Statement — September 2026 · Version 2", meta: "Approved · prev → new", engagement: "2026 External Audit" },
  { id: "ev-6", time: "09:12:00", ago: "Yesterday", actor: "Jane Williams", org: "Meridian Audit Partners", action: "REQUESTED", target: "Supplier invoices", meta: "REQ-024 · due 22 Sept", engagement: "2026 External Audit" },
  { id: "ev-7", time: "08:40:11", ago: "Yesterday", actor: "Daniel Ibrahim", org: "Apex Manufacturing Ltd.", action: "COMPLETED", target: "Payroll summary — September", meta: "REQ-025 → completed", engagement: "2026 External Audit" },
];

export const DEMO_FILINGS = [
  { id: "fil-1", title: "Corporate Tax 2026", year: "2026", status: "prepared", due: "30 June 2027", owner: "Finance Team", docs: 4 },
  { id: "fil-2", title: "VAT Q3 2026", year: "2026", status: "ready_for_review", due: "21 Oct 2026", owner: "Sarah Okafor", docs: 3 },
  { id: "fil-3", title: "PAYE Annual Return", year: "2025", status: "submitted", due: "31 Jan 2026", owner: "HR & Payroll", docs: 6 },
  { id: "fil-4", title: "Audited Financial Statements", year: "2025", status: "accepted", due: "30 Sept 2026", owner: "Meridian Audit Partners", docs: 9 },
];

export const DEMO_NOTIFICATIONS = [
  { id: "n-1", title: "You were assigned a new request", body: "Bank reconciliation evidence · due in 2 days", time: "10m" },
  { id: "n-2", title: "Meridian uploaded a document", body: "Management letter draft v1", time: "1h" },
  { id: "n-3", title: "Michael requested changes", body: "Bank Statement.pdf — missing page 4", time: "2h" },
  { id: "n-4", title: "Tax filing deadline approaching", body: "VAT Q3 2026 due 21 Oct", time: "1d" },
];

export const DEMO_ATTENTION = [
  { id: "a-1", level: "red", title: "Bank reconciliation evidence", sub: "2026 External Audit · Requested from Finance", meta: "2 days overdue", link: "/requests?status=overdue" },
  { id: "a-2", level: "amber", title: "Document awaiting review", sub: "Supplier Invoices — Q3 Pack · by Sarah", meta: "Waiting 6 hrs", link: "/documents/doc-2" },
  { id: "a-3", level: "amber", title: "Filing approaching deadline", sub: "VAT Q3 2026 · due 21 Oct", meta: "16 days left", link: "/filings" },
  { id: "a-4", level: "green", title: "External auditor requesting evidence", sub: "Meridian Audit Partners · 2 new requests", meta: "Needs response", link: "/requests" },
  { id: "a-5", level: "red", title: "Approval required", sub: "Accounts Receivable Report · v2", meta: "Assigned to you", link: "/documents/doc-7" },
];
