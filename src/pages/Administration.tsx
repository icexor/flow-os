import { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  Shield, Users, Key, AlertTriangle, CheckCircle,
  Plus, Edit, Trash2,
  Globe, Bell, Activity,
  MoreHorizontal, User, Lock, Unlock, ChevronRight, Eye, Menu
} from "lucide-react";
import { roles as initialRoles, approvalQueue } from "@/lib/data";
import { defaultRolePermissions, allModules, allActions, type PermissionModule, type PermissionAction, type RolePermissions } from "@/lib/permissions";
import { useIsMobile } from "@/hooks/use-mobile";

const adminSections = [
  { id: "approvals", label: "Approval Queue", icon: CheckCircle, badge: 7, color: "text-orange-400" },
  { id: "users", label: "User Management", icon: Users, badge: 12, color: "text-blue-400" },
  { id: "roles", label: "Roles & Permissions", icon: Shield, badge: null, color: "text-purple-400" },
  { id: "audit", label: "Audit Logs", icon: Activity, badge: null, color: "text-emerald-400" },
  { id: "integrations", label: "Integrations", icon: Globe, badge: 2, color: "text-blue-400" },
  { id: "api", label: "API Keys", icon: Key, badge: null, color: "text-yellow-400" },
  { id: "notifications", label: "Notifications", icon: Bell, badge: null, color: "text-red-400" },
];

const auditLogs = [
  { id: "al1", user: "Finance Agent", action: "Invoice approved automatically", resource: "INV-2024-0843", time: "5 min ago", type: "ai" },
  { id: "al2", user: "Arjay Delos Santos", action: "Approved procurement request", resource: "Summit Concrete", time: "1 hour ago", type: "human" },
  { id: "al3", user: "Carlos Rivera", action: "Updated project status", resource: "Downtown Tower", time: "2 hours ago", type: "human" },
  { id: "al4", user: "Construction Agent", action: "Flagged media for review", resource: "Marina Foundation Photo", time: "3 hours ago", type: "ai" },
  { id: "al5", user: "Legal Agent", action: "Contract risk analysis completed", resource: "Pinnacle Hotels Contract", time: "4 hours ago", type: "ai" },
  { id: "al6", user: "Sofia Nguyen", action: "Created change order", resource: "Pinnacle Resort CO#7", time: "5 hours ago", type: "human" },
];

const integrations = [
  { name: "Google Workspace", status: "connected", icon: "G", color: "bg-blue-500/15 text-blue-400" },
  { name: "Microsoft 365", status: "connected", icon: "M", color: "bg-blue-600/15 text-blue-400" },
  { name: "OpenAI GPT-4", status: "connected", icon: "O", color: "bg-emerald-500/15 text-emerald-400" },
  { name: "Anthropic Claude", status: "connected", icon: "A", color: "bg-purple-500/15 text-purple-400" },
  { name: "ClickUp", status: "connected", icon: "C", color: "bg-pink-500/15 text-pink-400" },
  { name: "Stripe", status: "disconnected", icon: "S", color: "bg-muted text-muted-foreground" },
  { name: "QuickBooks", status: "disconnected", icon: "Q", color: "bg-muted text-muted-foreground" },
  { name: "Slack", status: "connected", icon: "S", color: "bg-orange-500/15 text-orange-400" },
  { name: "Google Drive", status: "connected", icon: "D", color: "bg-yellow-500/15 text-yellow-400" },
  { name: "Webhook", status: "configured", icon: "W", color: "bg-blue-400/15 text-blue-300" },
  { name: "REST API", status: "configured", icon: "R", color: "bg-blue-400/15 text-blue-300" },
  { name: "Dropbox", status: "disconnected", icon: "D", color: "bg-muted text-muted-foreground" },
];

interface Role {
  id: string;
  name: string;
  description: string;
  color: string;
  user: string;
}

interface AdminProps {
  onNavigate: (page: string) => void;
}

export function Administration({ }: AdminProps) {
  const isMobile = useIsMobile();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("approvals");
  const [approvalFilter, setApprovalFilter] = useState("waiting");
  const [approvedItems, setApprovedItems] = useState<Set<string>>(new Set());
  const [rejectedItems, setRejectedItems] = useState<Set<string>>(new Set());
  const [rejectedReasons, setRejectedReasons] = useState<Record<string, string>>({});

  // Role management state
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [newRoleDialog, setNewRoleDialog] = useState(false);
  const [deleteRoleDialog, setDeleteRoleDialog] = useState<Role | null>(null);
  const [roleForm, setRoleForm] = useState({ name: "", description: "", color: "blue", user: "" });

  // Permission editing state
  const [editingPermissions, setEditingPermissions] = useState<RolePermissions | null>(null);
  const [permissionForm, setPermissionForm] = useState<RolePermissions | null>(null);

  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; type: "approve" | "reject"; itemId: string | null }>({ open: false, type: "approve", itemId: null });
  const [rejectReason, setRejectReason] = useState("");

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    setMobileNavOpen(false);
  };

  const AdminNav = () => (
    <>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Admin Sections</p>
      <div className="space-y-1">
        {adminSections.map(section => (
          <button
            key={section.id}
            onClick={() => handleSectionChange(section.id)}
            className={cn(
              "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all text-left",
              activeSection === section.id
                ? "bg-primary/15 text-primary border border-primary/20"
                : "text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent"
            )}
          >
            <section.icon className={cn("w-4 h-4", activeSection === section.id ? "text-primary" : section.color)} />
            <span className="flex-1 font-medium">{section.label}</span>
            {section.badge && (
              <span className="bg-orange-500/20 text-orange-400 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                {section.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    </>
  );

  const approvalFilters = [
    { id: "waiting", label: "Waiting", count: approvalQueue.filter(a => !approvedItems.has(a.id) && !rejectedItems.has(a.id)).length },
    { id: "approved", label: "Approved", count: approvedItems.size },
    { id: "rejected", label: "Rejected", count: rejectedItems.size },
  ];

  const filteredApprovals = approvalQueue.filter(a => {
    if (approvalFilter === "waiting") return !approvedItems.has(a.id) && !rejectedItems.has(a.id);
    if (approvalFilter === "approved") return approvedItems.has(a.id);
    if (approvalFilter === "rejected") return rejectedItems.has(a.id);
    return true;
  });

  const handleAddRole = () => {
    const newRole: Role = {
      id: `role-${Date.now()}`,
      name: roleForm.name,
      description: roleForm.description,
      color: roleForm.color,
      user: roleForm.user || "Unassigned",
    };
    setRoles(prev => [...prev, newRole]);
    setNewRoleDialog(false);
    setRoleForm({ name: "", description: "", color: "blue", user: "" });
  };

  const handleEditRole = () => {
    if (!editingRole) return;
    setRoles(prev => prev.map(r => r.id === editingRole.id ? { ...r, name: roleForm.name, description: roleForm.description, color: roleForm.color, user: roleForm.user || r.user } : r));
    setEditingRole(null);
    setRoleForm({ name: "", description: "", color: "blue", user: "" });
  };

  const handleDeleteRole = () => {
    if (!deleteRoleDialog) return;
    setRoles(prev => prev.filter(r => r.id !== deleteRoleDialog.id));
    setDeleteRoleDialog(null);
  };

  const openEditRole = (role: Role) => {
    setEditingRole(role);
    setRoleForm({ name: role.name, description: role.description, color: role.color, user: role.user });
  };

  const openApproveConfirm = (itemId: string) => {
    setConfirmDialog({ open: true, type: "approve", itemId });
  };

  const openRejectConfirm = (itemId: string) => {
    setRejectReason("");
    setConfirmDialog({ open: true, type: "reject", itemId });
  };

  const confirmAction = () => {
    const { type, itemId } = confirmDialog;
    if (!itemId) return;
    if (type === "approve") {
      setApprovedItems(prev => new Set([...prev, itemId]));
    } else if (type === "reject") {
      if (!rejectReason.trim()) return;
      setRejectedItems(prev => new Set([...prev, itemId]));
      setRejectedReasons(prev => ({ ...prev, [itemId]: rejectReason.trim() }));
    }
    setConfirmDialog({ open: false, type: "approve", itemId: null });
    setRejectReason("");
  };

  const confirmItem = confirmDialog.itemId ? approvalQueue.find(a => a.id === confirmDialog.itemId) : null;

  const openPermissionEditor = (roleId: string) => {
    const rolePerm = defaultRolePermissions.find(r => r.id === roleId);
    if (rolePerm) {
      setEditingPermissions(rolePerm);
      setPermissionForm(JSON.parse(JSON.stringify(rolePerm)));
    }
  };

  const togglePermission = (module: PermissionModule, action: PermissionAction) => {
    if (!permissionForm) return;
    const perms = [...permissionForm.permissions];
    const idx = perms.findIndex(p => p.module === module);
    if (idx >= 0) {
      const actions = perms[idx].actions.includes(action)
        ? perms[idx].actions.filter(a => a !== action)
        : [...perms[idx].actions, action];
      if (actions.length === 0) {
        perms.splice(idx, 1);
      } else {
        perms[idx] = { ...perms[idx], actions };
      }
    } else {
      perms.push({ module, actions: [action] });
    }
    setPermissionForm({ ...permissionForm, permissions: perms });
  };

  const hasPerm = (module: PermissionModule, action: PermissionAction) => {
    if (!permissionForm) return false;
    return permissionForm.permissions.some(p => p.module === module && p.actions.includes(action));
  };

  const savePermissions = () => {
    // In a real app, this would persist to backend
    setEditingPermissions(null);
    setPermissionForm(null);
  };

  const getRoleColorClass = (roleId: string) => {
    switch (roleId) {
      case "ceo": return "bg-blue-500";
      case "finance": return "bg-emerald-500";
      case "pm": return "bg-purple-500";
      case "construction": return "bg-orange-500";
      case "worker": return "bg-gray-500";
      case "customer": return "bg-green-500";
      default: return "bg-primary";
    }
  };

  return (
    <div className="flex gap-4">
      {/* Left Nav - Desktop */}
      {!isMobile && (
        <div className="w-52 flex-shrink-0">
          <AdminNav />
        </div>
      )}

      {/* Left Nav - Mobile Sheet */}
      {isMobile && (
        <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
          <SheetContent side="left" className="w-64 p-4">
            <AdminNav />
          </SheetContent>
        </Sheet>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-4">
        {isMobile && (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => setMobileNavOpen(true)}>
              <Menu className="w-4 h-4" />
            </Button>
            <span className="text-sm font-semibold text-foreground">
              {adminSections.find(s => s.id === activeSection)?.label}
            </span>
          </div>
        )}
        {activeSection === "approvals" && (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-foreground">Approval Queue</h2>
                <p className="text-xs text-muted-foreground">All AI-generated actions require human approval</p>
              </div>
            </div>

            <div className="flex gap-2">
              {approvalFilters.map(f => (
                <button
                  key={f.id}
                  onClick={() => setApprovalFilter(f.id)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border",
                    approvalFilter === f.id
                      ? "bg-primary/15 text-primary border-primary/30"
                      : "bg-muted text-muted-foreground border-transparent hover:text-foreground"
                  )}
                >
                  <span>{f.label}</span>
                  <span className={cn("text-[10px] rounded-full px-1.5 py-0.5", approvalFilter === f.id ? "bg-primary/20" : "bg-background")}>
                    {f.count}
                  </span>
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {filteredApprovals.length === 0 && (
                <div className="flex flex-col items-center justify-center h-32 text-center">
                  <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-foreground">All clear!</p>
                  <p className="text-xs text-muted-foreground">No items in this category</p>
                </div>
              )}
              {filteredApprovals.map(item => (
                <Card key={item.id} className="glass-subtle border-border/60 dark-glow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={cn("text-[9px] border",
                            item.priority === "urgent" ? "bg-red-500/20 text-red-400 border-red-500/30" :
                            item.priority === "high" ? "bg-orange-500/20 text-orange-400 border-orange-500/30" :
                            "bg-blue-500/20 text-blue-400 border-blue-500/30"
                          )}>
                            {item.priority}
                          </Badge>
                          <Badge variant="outline" className="text-[9px]">{item.category}</Badge>
                        </div>
                        <p className="text-sm font-semibold text-foreground">{item.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Project: {item.project} · Requested by: {item.requestedBy} · {item.submittedAt}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        {item.amount && <p className="text-base font-bold text-foreground">${(item.amount / 1000).toFixed(0)}K</p>}
                        <p className="text-[10px] text-muted-foreground">Due in {item.dueBy}</p>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg border border-primary/20 bg-primary/5 mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-semibold text-primary flex items-center gap-1"><Shield className="w-3 h-3" />AI Reasoning</span>
                        <span className="text-[10px] text-muted-foreground">Confidence: {item.confidence}%</span>
                      </div>
                      <p className="text-xs text-foreground/80">{item.aiReasoning}</p>
                    </div>

                    {approvedItems.has(item.id) && (
                      <div className="flex items-center gap-2 text-emerald-400 text-sm">
                        <CheckCircle className="w-4 h-4" />
                        <span className="font-medium">Approved</span>
                      </div>
                    )}
                    {rejectedItems.has(item.id) && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-red-400 text-sm">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="font-medium">Rejected</span>
                        </div>
                        {rejectedReasons[item.id] && (
                          <p className="text-xs text-red-300/80 bg-red-500/10 border border-red-500/20 rounded-md p-2">
                            Reason: {rejectedReasons[item.id]}
                          </p>
                        )}
                      </div>
                    )}

                    {!approvedItems.has(item.id) && !rejectedItems.has(item.id) && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <Button
                          size="sm"
                          className="gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                          onClick={() => openApproveConfirm(item.id)}
                        >
                          <CheckCircle className="w-3.5 h-3.5" />Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5 text-xs"
                        >
                          <Edit className="w-3.5 h-3.5" />Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5 text-xs"
                        >
                          <User className="w-3.5 h-3.5" />Reassign
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5 text-xs border-red-500/30 text-red-400 hover:bg-red-500/10 ml-auto"
                          onClick={() => openRejectConfirm(item.id)}
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Confirmation Dialog */}
            <Dialog open={confirmDialog.open} onOpenChange={(open) => {
              if (!open) setConfirmDialog({ open: false, type: "approve", itemId: null });
            }}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {confirmDialog.type === "approve" ? "Confirm Approval" : "Confirm Rejection"}
                  </DialogTitle>
                  <DialogDescription>
                    {confirmDialog.type === "approve"
                      ? "Are you sure you want to approve this action?"
                      : "Please provide a reason for rejecting this action."}
                  </DialogDescription>
                </DialogHeader>
                {confirmItem && (
                  <div className="space-y-2 py-2">
                    <p className="text-sm font-medium text-foreground">{confirmItem.title}</p>
                    <p className="text-xs text-muted-foreground">Project: {confirmItem.project} · Requested by: {confirmItem.requestedBy}</p>
                    {confirmItem.amount && (
                      <p className="text-sm font-semibold text-foreground">${(confirmItem.amount / 1000).toFixed(0)}K</p>
                    )}
                  </div>
                )}
                {confirmDialog.type === "reject" && (
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-foreground">Rejection Reason <span className="text-red-400">*</span></label>
                    <Textarea
                      placeholder="Enter reason for rejection..."
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      className="text-xs"
                    />
                    {!rejectReason.trim() && (
                      <p className="text-[10px] text-red-400">A reason is required to reject.</p>
                    )}
                  </div>
                )}
                <DialogFooter>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setConfirmDialog({ open: false, type: "approve", itemId: null })}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    className={cn(
                      confirmDialog.type === "approve" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-600 hover:bg-red-700"
                    )}
                    onClick={confirmAction}
                    disabled={confirmDialog.type === "reject" && !rejectReason.trim()}
                  >
                    {confirmDialog.type === "approve" ? "Confirm Approval" : "Confirm Rejection"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}

        {activeSection === "users" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">User Management</h2>
              <Button size="sm" className="gap-1.5 text-xs"><Plus className="w-3.5 h-3.5" />Invite User</Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {["Arjay Delos Santos (CEO)", "Patricia Wells (CFO)", "Carlos Rivera (PM)", "Sofia Nguyen (PM)", "Robert Chen (CM)", "Diana Walsh (Safety)", "Jenny Park (PM)", "Mike Thompson (Procurement)", "Marcus Webb (PM)", "David Kim (Customer)", "Sarah Chen (Customer)", "James Cooper (Worker)"].map((user, i) => (
                <div key={i} className="p-3 rounded-lg border border-border/60 bg-card hover:border-border transition-all dark-glow">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                      {user.split(" ").slice(0, 2).map(n => n[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">{user.split(" (")[0]}</p>
                      <p className="text-[10px] text-muted-foreground">{user.match(/\((.+)\)/)?.[1]}</p>
                    </div>
                    <button className="text-muted-foreground hover:text-foreground"><MoreHorizontal className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === "roles" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-foreground">Roles & Permissions</h2>
                <p className="text-xs text-muted-foreground">Configure role-based access control for all modules</p>
              </div>
              <Button size="sm" className="gap-1.5 text-xs" onClick={() => { setNewRoleDialog(true); setRoleForm({ name: "", description: "", color: "blue", user: "" }); }}>
                <Plus className="w-3.5 h-3.5" />Add New Role
              </Button>
            </div>

            {/* Role Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {roles.map(role => {
                const rolePerm = defaultRolePermissions.find(r => r.id === role.id);
                const moduleCount = rolePerm?.permissions.filter(p => p.actions.includes("view")).length || 0;
                const totalPerms = rolePerm?.permissions.reduce((acc, p) => acc + p.actions.length, 0) || 0;
                return (
                  <Card key={role.id} className="glass-subtle border-border/60 dark-glow group">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={cn("w-2.5 h-2.5 rounded-full", getRoleColorClass(role.id))} />
                          <p className="text-sm font-semibold text-foreground">{role.name}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="outline" size="sm" className="text-xs h-6 gap-1" onClick={() => openEditRole(role)}>
                            <Edit className="w-2.5 h-2.5" />Edit
                          </Button>
                          <Button variant="outline" size="sm" className="text-xs h-6 gap-1 border-red-500/30 text-red-400 hover:bg-red-500/10" onClick={() => setDeleteRoleDialog(role)}>
                            <Trash2 className="w-2.5 h-2.5" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">{role.description}</p>

                      {/* Permission Summary */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-muted-foreground">Module Access</span>
                          <span className="text-[10px] font-medium text-foreground">{moduleCount} / {allModules.length} modules</span>
                        </div>
                        <div className="flex items-center gap-1 flex-wrap">
                          {allModules.map(m => {
                            const hasView = rolePerm?.permissions.some(p => p.module === m.id && p.actions.includes("view"));
                            return (
                              <div key={m.id} className={cn(
                                "px-1.5 py-0.5 rounded text-[9px] font-medium transition-colors",
                                hasView ? "bg-primary/15 text-primary border border-primary/20" : "bg-muted text-muted-foreground/50 border border-transparent"
                              )} title={m.label}>
                                {m.label}
                              </div>
                            );
                          })}
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[10px] text-muted-foreground">Total Permissions</span>
                          <span className="text-[10px] font-medium text-foreground">{totalPerms} actions</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/40">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3 h-3 text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground">{role.user}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-[10px] gap-1 text-primary hover:text-primary/80 hover:bg-primary/5 px-2"
                          onClick={() => openPermissionEditor(role.id)}
                        >
                          <Eye className="w-3 h-3" />
                          Configure Permissions
                          <ChevronRight className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Add Role Dialog */}
            <Dialog open={newRoleDialog} onOpenChange={setNewRoleDialog}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Role</DialogTitle>
                  <DialogDescription>Create a new role with name, description, and color.</DialogDescription>
                </DialogHeader>
                <div className="space-y-3 py-2">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">Name</label>
                    <Input placeholder="Role name" value={roleForm.name} onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })} className="text-xs" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">Description</label>
                    <Textarea placeholder="Role description" value={roleForm.description} onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })} className="text-xs" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">Color</label>
                    <Input placeholder="blue, emerald, purple, orange, red..." value={roleForm.color} onChange={(e) => setRoleForm({ ...roleForm, color: e.target.value })} className="text-xs" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">Example User</label>
                    <Input placeholder="Example user name" value={roleForm.user} onChange={(e) => setRoleForm({ ...roleForm, user: e.target.value })} className="text-xs" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" size="sm" onClick={() => setNewRoleDialog(false)}>Cancel</Button>
                  <Button size="sm" onClick={handleAddRole} disabled={!roleForm.name.trim() || !roleForm.description.trim()}>Add Role</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Edit Role Dialog */}
            <Dialog open={!!editingRole} onOpenChange={(open) => { if (!open) setEditingRole(null); }}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Edit Role</DialogTitle>
                  <DialogDescription>Update role name, description, and color.</DialogDescription>
                </DialogHeader>
                <div className="space-y-3 py-2">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">Name</label>
                    <Input placeholder="Role name" value={roleForm.name} onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })} className="text-xs" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">Description</label>
                    <Textarea placeholder="Role description" value={roleForm.description} onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })} className="text-xs" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">Color</label>
                    <Input placeholder="blue, emerald, purple, orange, red..." value={roleForm.color} onChange={(e) => setRoleForm({ ...roleForm, color: e.target.value })} className="text-xs" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">Example User</label>
                    <Input placeholder="Example user name" value={roleForm.user} onChange={(e) => setRoleForm({ ...roleForm, user: e.target.value })} className="text-xs" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" size="sm" onClick={() => setEditingRole(null)}>Cancel</Button>
                  <Button size="sm" onClick={handleEditRole} disabled={!roleForm.name.trim() || !roleForm.description.trim()}>Save Changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Delete Role Dialog */}
            <Dialog open={!!deleteRoleDialog} onOpenChange={(open) => { if (!open) setDeleteRoleDialog(null); }}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Delete Role</DialogTitle>
                  <DialogDescription>Are you sure you want to delete this role? This action cannot be undone.</DialogDescription>
                </DialogHeader>
                {deleteRoleDialog && (
                  <div className="py-2">
                    <p className="text-sm font-medium text-foreground">{deleteRoleDialog.name}</p>
                    <p className="text-xs text-muted-foreground">{deleteRoleDialog.description}</p>
                  </div>
                )}
                <DialogFooter>
                  <Button variant="outline" size="sm" onClick={() => setDeleteRoleDialog(null)}>Cancel</Button>
                  <Button size="sm" variant="destructive" onClick={handleDeleteRole}>Delete</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Permission Editor Dialog */}
            <Dialog open={!!editingPermissions} onOpenChange={(open) => { if (!open) { setEditingPermissions(null); setPermissionForm(null); } }}>
              <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    Configure Permissions: {editingPermissions?.name}
                  </DialogTitle>
                  <DialogDescription>
                    Set which modules and actions this role can access. Toggle permissions per module.
                  </DialogDescription>
                </DialogHeader>

                {permissionForm && (
                  <div className="space-y-4 py-2">
                    <div className="p-3 rounded-lg border border-primary/20 bg-primary/5">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={cn("w-3 h-3 rounded-full", getRoleColorClass(permissionForm.id))} />
                        <p className="text-sm font-semibold text-foreground">{permissionForm.name}</p>
                        <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">
                          {permissionForm.permissions.filter(p => p.actions.includes("view")).length} modules
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{permissionForm.description}</p>
                    </div>

                    {/* Permission Grid */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 pb-2 border-b border-border/40">
                        <span className="text-xs font-semibold text-muted-foreground w-32">Module</span>
                        <div className="flex-1 grid grid-cols-5 gap-2">
                          {allActions.map(action => (
                            <span key={action} className="text-[10px] font-semibold text-muted-foreground text-center uppercase">{action}</span>
                          ))}
                        </div>
                      </div>

                      {allModules.map(module => {
                        const hasView = hasPerm(module.id, "view");
                        return (
                          <div key={module.id} className={cn(
                            "flex items-center gap-2 py-2 rounded-lg transition-colors",
                            hasView ? "bg-card/60" : "opacity-50"
                          )}>
                            <div className="w-32 flex items-center gap-2 px-2">
                              {hasView ? <Unlock className="w-3 h-3 text-emerald-400" /> : <Lock className="w-3 h-3 text-muted-foreground" />}
                              <span className="text-xs font-medium text-foreground">{module.label}</span>
                            </div>
                            <div className="flex-1 grid grid-cols-5 gap-2">
                              {allActions.map(action => (
                                <div key={action} className="flex justify-center">
                                  <Checkbox
                                    checked={hasPerm(module.id, action)}
                                    onCheckedChange={() => togglePermission(module.id, action)}
                                    className={cn(
                                      "border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary",
                                      action === "delete" && "data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
                                    )}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border/40">
                      <div className="text-xs text-muted-foreground">
                        Total: {permissionForm.permissions.reduce((acc, p) => acc + p.actions.length, 0)} permission grants
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => { setEditingPermissions(null); setPermissionForm(null); }}>Cancel</Button>
                        <Button size="sm" onClick={savePermissions}>
                          <CheckCircle className="w-3.5 h-3.5 mr-1" />
                          Save Permissions
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        )}

        {activeSection === "audit" && (
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">Audit Logs</h2>
            <Card className="glass-subtle border-border/60 dark-glow">
              <CardContent className="p-0">
                {auditLogs.map(log => (
                  <div key={log.id} className="flex items-center gap-3 p-3 border-b border-border/40 last:border-0 hover:bg-muted transition-colors">
                    <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0",
                      log.type === "ai" ? "bg-primary/15" : "bg-blue-500/15"
                    )}>
                      {log.type === "ai" ? <Shield className="w-3.5 h-3.5 text-primary" /> : <User className="w-3.5 h-3.5 text-blue-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-foreground">{log.user}</span>
                        <Badge className={cn("text-[8px] h-3.5 px-1 border-0", log.type === "ai" ? "bg-primary/20 text-primary" : "bg-blue-500/20 text-blue-400")}>
                          {log.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{log.action} · <span className="text-primary">{log.resource}</span></p>
                    </div>
                    <span className="text-[10px] text-muted-foreground flex-shrink-0">{log.time}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {activeSection === "integrations" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">Integrations</h2>
              <Button size="sm" className="gap-1.5 text-xs"><Plus className="w-3.5 h-3.5" />Connect New</Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {integrations.map(int => (
                <div key={int.name} className="p-3 rounded-lg border border-border/60 bg-card hover:border-border transition-all dark-glow">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold", int.color)}>
                      {int.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">{int.name}</p>
                    </div>
                  </div>
                  <Badge className={cn("text-[9px] border",
                    int.status === "connected" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" :
                    int.status === "configured" ? "bg-blue-500/20 text-blue-400 border-blue-500/30" :
                    "bg-muted text-muted-foreground border-border"
                  )}>
                    {int.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {(activeSection === "api" || activeSection === "notifications") && (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
              {activeSection === "api" ? <Key className="w-6 h-6 text-muted-foreground" /> : <Bell className="w-6 h-6 text-muted-foreground" />}
            </div>
            <p className="text-sm font-medium text-foreground capitalize">{activeSection === "api" ? "API Keys" : "Notification Settings"}</p>
            <p className="text-xs text-muted-foreground text-center max-w-xs">
              {activeSection === "api" ? "Manage API keys for external integrations and webhook access." : "Configure how and when you receive notifications from FlowOS."}
            </p>
            <Button size="sm" className="text-xs gap-1.5">
              <Plus className="w-3.5 h-3.5" />Configure
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
