// Role-based permission system for FlowOS

export type PermissionModule =
  | "dashboard"
  | "inbox"
  | "customers"
  | "projects"
  | "tasks"
  | "documents"
  | "media"
  | "reports"
  | "finance"
  | "automation"
  | "ai-agents"
  | "administration"
  | "settings"
  | "ai-dataflow"
  | "business-intelligence";

export type PermissionAction = "view" | "create" | "edit" | "delete" | "approve";

export interface Permission {
  module: PermissionModule;
  actions: PermissionAction[];
}

export interface RolePermissions {
  id: string;
  name: string;
  description: string;
  color: string;
  user: string;
  email: string;
  avatar: string;
  permissions: Permission[];
}

export const allModules: { id: PermissionModule; label: string }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "inbox", label: "Inbox" },
  { id: "customers", label: "Customers" },
  { id: "projects", label: "Projects" },
  { id: "tasks", label: "Tasks" },
  { id: "documents", label: "Documents" },
  { id: "media", label: "Media" },
  { id: "reports", label: "Reports" },
  { id: "finance", label: "Finance" },
  { id: "automation", label: "Automation" },
  { id: "ai-agents", label: "AI Agents" },
  { id: "administration", label: "Administration" },
  { id: "settings", label: "Settings" },
  { id: "ai-dataflow", label: "AI Data Flow" },
  { id: "business-intelligence", label: "Business Intelligence" },
];

export const allActions: PermissionAction[] = ["view", "create", "edit", "delete", "approve"];

export const defaultRolePermissions: RolePermissions[] = [
  {
    id: "ceo",
    name: "CEO",
    description: "Full system access - oversees all business operations",
    color: "blue",
    user: "Arjay Delos Santos",
    email: "arjay_ds@flowos.com",
    avatar: "AD",
    permissions: allModules.map((m) => ({ module: m.id, actions: [...allActions] })),
  },
  {
    id: "finance",
    name: "Finance Manager",
    description: "Financial modules, reports, and invoice management",
    color: "emerald",
    user: "Patricia Wells",
    email: "p.wells@flowos.com",
    avatar: "PW",
    permissions: [
      { module: "dashboard", actions: ["view"] },
      { module: "inbox", actions: ["view", "create", "edit"] },
      { module: "customers", actions: ["view"] },
      { module: "projects", actions: ["view"] },
      { module: "tasks", actions: ["view", "create", "edit"] },
      { module: "documents", actions: ["view", "create", "edit"] },
      { module: "media", actions: ["view"] },
      { module: "reports", actions: ["view", "create", "edit"] },
      { module: "finance", actions: ["view", "create", "edit", "delete", "approve"] },
      { module: "automation", actions: ["view"] },
      { module: "ai-agents", actions: ["view"] },
      { module: "administration", actions: ["view", "approve"] },
      { module: "settings", actions: ["view", "edit"] },
      { module: "ai-dataflow", actions: ["view"] },
      { module: "business-intelligence", actions: ["view"] },
    ],
  },
  {
    id: "pm",
    name: "Project Manager",
    description: "Projects, tasks, documents, and team coordination",
    color: "purple",
    user: "Carlos Rivera",
    email: "c.rivera@flowos.com",
    avatar: "CR",
    permissions: [
      { module: "dashboard", actions: ["view"] },
      { module: "inbox", actions: ["view", "create", "edit"] },
      { module: "customers", actions: ["view", "create", "edit"] },
      { module: "projects", actions: ["view", "create", "edit", "delete"] },
      { module: "tasks", actions: ["view", "create", "edit", "delete"] },
      { module: "documents", actions: ["view", "create", "edit", "delete"] },
      { module: "media", actions: ["view", "create", "edit"] },
      { module: "reports", actions: ["view", "create"] },
      { module: "finance", actions: ["view"] },
      { module: "automation", actions: ["view"] },
      { module: "ai-agents", actions: ["view"] },
      { module: "settings", actions: ["view", "edit"] },
      { module: "ai-dataflow", actions: ["view"] },
      { module: "business-intelligence", actions: ["view"] },
    ],
  },
  {
    id: "construction",
    name: "Construction Manager",
    description: "Site operations, safety, and field team management",
    color: "orange",
    user: "Robert Chen",
    email: "r.chen@flowos.com",
    avatar: "RC",
    permissions: [
      { module: "dashboard", actions: ["view"] },
      { module: "inbox", actions: ["view", "create", "edit"] },
      { module: "customers", actions: ["view"] },
      { module: "projects", actions: ["view", "edit"] },
      { module: "tasks", actions: ["view", "create", "edit", "delete"] },
      { module: "documents", actions: ["view", "create", "edit"] },
      { module: "media", actions: ["view", "create", "edit", "delete"] },
      { module: "reports", actions: ["view"] },
      { module: "finance", actions: ["view"] },
      { module: "automation", actions: ["view"] },
      { module: "ai-agents", actions: ["view"] },
      { module: "settings", actions: ["view", "edit"] },
      { module: "ai-dataflow", actions: ["view"] },
      { module: "business-intelligence", actions: ["view"] },
    ],
  },
  {
    id: "worker",
    name: "Site Worker",
    description: "Assigned tasks, timesheets, and safety reports",
    color: "gray",
    user: "James Cooper",
    email: "j.cooper@flowos.com",
    avatar: "JC",
    permissions: [
      { module: "dashboard", actions: ["view"] },
      { module: "inbox", actions: ["view", "create"] },
      { module: "projects", actions: ["view"] },
      { module: "tasks", actions: ["view", "edit"] },
      { module: "documents", actions: ["view"] },
      { module: "media", actions: ["view", "create"] },
      { module: "settings", actions: ["view", "edit"] },
    ],
  },
  {
    id: "customer",
    name: "Customer Portal",
    description: "Project status, invoices, and communication",
    color: "green",
    user: "David Kim",
    email: "d.kim@nexusproperty.com",
    avatar: "DK",
    permissions: [
      { module: "dashboard", actions: ["view"] },
      { module: "inbox", actions: ["view", "create"] },
      { module: "projects", actions: ["view"] },
      { module: "documents", actions: ["view"] },
      { module: "media", actions: ["view"] },
      { module: "finance", actions: ["view"] },
      { module: "settings", actions: ["view", "edit"] },
    ],
  },
];

export function getRolePermissions(roleId: string): RolePermissions | undefined {
  return defaultRolePermissions.find((r) => r.id === roleId);
}

export function hasPermission(
  roleId: string,
  module: PermissionModule,
  action: PermissionAction
): boolean {
  const role = getRolePermissions(roleId);
  if (!role) return false;
  const perm = role.permissions.find((p) => p.module === module);
  if (!perm) return false;
  return perm.actions.includes(action);
}

export function getAllowedModules(roleId: string): PermissionModule[] {
  const role = getRolePermissions(roleId);
  if (!role) return [];
  return role.permissions.filter((p) => p.actions.includes("view")).map((p) => p.module);
}
