import { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Settings as SettingsIcon, User, Bell, Shield, Palette, Globe,
  Key, Database, Zap, Check, Moon, Sun,
  Building, Save
} from "lucide-react";
import type { ThemeMode, AccentColor } from "@/hooks/use-appearance";

const settingsSections = [
  { id: "profile", label: "Profile", icon: User },
  { id: "company", label: "Company", icon: Building },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "ai", label: "AI Configuration", icon: Zap },
  { id: "data", label: "Data & Storage", icon: Database },
  { id: "account", label: "Account", icon: Key },
];

const accentOptions: { id: AccentColor; label: string; color: string; ring: string }[] = [
  { id: "electric-blue", label: "Electric Blue", color: "bg-[oklch(0.60_0.22_250)]", ring: "ring-[oklch(1_0_0)]" },
  { id: "emerald", label: "Emerald", color: "bg-[oklch(1.0_0.18_155)]", ring: "ring-[oklch(1_0_0)]" },
  { id: "purple", label: "Purple", color: "bg-[oklch(0.60_1.1_300)]", ring: "ring-[oklch(1_0_0)]" },
  { id: "amber", label: "Amber", color: "bg-[oklch(1.0_0.15_70)]", ring: "ring-[oklch(1_0_0)]" },
  { id: "rose", label: "Rose", color: "bg-[oklch(1.0_0.22_27)]", ring: "ring-[oklch(1_0_0)]" },
];

interface SettingsProps {
  onNavigate?: (page: string) => void;
  themeMode?: ThemeMode;
  accentColor?: AccentColor;
  onChangeTheme?: (mode: ThemeMode) => void;
  onChangeAccent?: (accent: AccentColor) => void;
}

export function Settings({ themeMode = "dark", accentColor = "electric-blue", onChangeTheme, onChangeAccent }: SettingsProps) {
  const [activeSection, setActiveSection] = useState("profile");
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    pushNotifications: true,
    aiSuggestions: true,
    approvalRequests: true,
    projectUpdates: true,
    invoiceAlerts: true,
    weeklyReport: true,
    riskAlerts: true,
  });
  const [aiSettings, setAiSettings] = useState({
    autoApproveBelow: false,
    confidenceThreshold: 95,
    autoGenerateReports: true,
    proactiveInsights: true,
    humanInLoop: true,
    processingMode: "balanced",
  });

  return (
    <div className="flex gap-4">
      {/* Left Nav */}
      <div className="w-52 flex-shrink-0">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Settings</p>
        <div className="space-y-1">
          {settingsSections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all text-left border",
                activeSection === section.id
                  ? "bg-primary/15 text-primary border-primary/20"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground border-transparent"
              )}
            >
              <section.icon className="w-4 h-4" />
              <span className="font-medium">{section.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <Card className="flex-1 glass-subtle border-border/60">
        <CardContent className="p-5">
          {activeSection === "profile" && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-bold text-foreground">Profile Settings</h2>
                <p className="text-xs text-muted-foreground">Manage your personal information</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary">MF</div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Arjay Delos Santos</p>
                  <p className="text-xs text-muted-foreground">CEO · Meridian Construction Group</p>
                  <Button variant="outline" size="sm" className="mt-2 text-xs h-7">Change Photo</Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Full Name", value: "Arjay Delos Santos" },
                  { label: "Job Title", value: "Chief Executive Officer" },
                  { label: "Email", value: "arjay_ds@flowos.com" },
                  { label: "Phone", value: "+63 (906) 123-1234" },
                  { label: "Department", value: "Executive" },
                  { label: "Location", value: "Manila, PH" },
                ].map(f => (
                  <div key={f.label} className="space-y-1">
                    <label className="text-xs text-muted-foreground font-medium">{f.label}</label>
                    <Input defaultValue={f.value} className="h-8 text-xs" />
                  </div>
                ))}
              </div>
              <Button size="sm" className="gap-1.5 text-xs"><Save className="w-3.5 h-3.5" />Save Changes</Button>
            </div>
          )}

          {activeSection === "appearance" && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-bold text-foreground">Appearance</h2>
                <p className="text-xs text-muted-foreground">Customize the look of FlowOS</p>
              </div>
              <div className="space-y-4">
                {/* Theme Mode */}
                <div>
                  <p className="text-sm font-medium text-foreground mb-3">Theme Mode</p>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "dark" as ThemeMode, label: "Dark", icon: Moon, desc: "Default" },
                      { id: "light" as ThemeMode, label: "Light", icon: Sun, desc: "Light mode" },
                      { id: "system" as ThemeMode, label: "System", icon: Globe, desc: "Auto" },
                    ].map(theme => {
                      const isActive = themeMode === theme.id;
                      return (
                        <button
                          key={theme.id}
                          onClick={() => onChangeTheme?.(theme.id)}
                          className={cn(
                            "p-3 rounded-lg border text-left transition-all",
                            isActive ? "border-primary/40 bg-primary/8 ring-1 ring-primary/20" : "border-border/60 hover:border-border"
                          )}
                        >
                          <theme.icon className={cn("w-5 h-5 mb-2", isActive ? "text-primary" : "text-muted-foreground")} />
                          <p className="text-xs font-medium text-foreground">{theme.label}</p>
                          <p className="text-[10px] text-muted-foreground">{theme.desc}</p>
                          {isActive && <Check className="w-3 h-3 text-primary mt-1" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Accent Color */}
                <div>
                  <p className="text-sm font-medium text-foreground mb-3">Accent Color</p>
                  <div className="flex gap-3">
                    {accentOptions.map(opt => {
                      const isActive = accentColor === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => onChangeAccent?.(opt.id)}
                          className="flex flex-col items-center gap-2 group"
                        >
                          <div
                            className={cn(
                              "w-10 h-10 rounded-full transition-all ring-offset-2 ring-offset-background",
                              opt.color,
                              isActive ? "ring-2 ring-white scale-110" : "hover:ring-2 hover:ring-white/50 hover:scale-105"
                            )}
                          />
                          <span className={cn("text-[10px] font-medium", isActive ? "text-foreground" : "text-muted-foreground")}>
                            {opt.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Preview */}
                <div className="p-3 rounded-lg border border-border/40 bg-muted">
                  <p className="text-xs text-muted-foreground mb-2">Preview</p>
                  <div className="flex items-center gap-3">
                    <div className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium">
                      Primary Button
                    </div>
                    <div className="px-3 py-1.5 rounded-md border border-primary/30 text-primary text-xs font-medium">
                      Outline Button
                    </div>
                    <div className="w-4 h-4 rounded-full bg-chart-1" />
                    <div className="w-4 h-4 rounded-full bg-chart-2" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "notifications" && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-bold text-foreground">Notification Preferences</h2>
                <p className="text-xs text-muted-foreground">Control when and how you receive alerts</p>
              </div>
              <div className="space-y-3">
                {Object.entries(notifications).map(([key, value]) => {
                  const labels: Record<string, { label: string; desc: string }> = {
                    emailAlerts: { label: "Email Alerts", desc: "Receive important updates via email" },
                    pushNotifications: { label: "Push Notifications", desc: "Browser and mobile notifications" },
                    aiSuggestions: { label: "AI Suggestions", desc: "When AI has recommendations for you" },
                    approvalRequests: { label: "Approval Requests", desc: "When items need your approval" },
                    projectUpdates: { label: "Project Updates", desc: "Status changes and milestones" },
                    invoiceAlerts: { label: "Invoice Alerts", desc: "Payment reminders and overdue notices" },
                    weeklyReport: { label: "Weekly Report", desc: "Automated executive summary" },
                    riskAlerts: { label: "Risk Alerts", desc: "Critical risk notifications from AI" },
                  };
                  const config = labels[key] || { label: key, desc: "" };
                  return (
                    <div key={key} className="flex items-center justify-between p-3 rounded-lg border border-border/40 bg-muted">
                      <div>
                        <p className="text-sm font-medium text-foreground">{config.label}</p>
                        <p className="text-xs text-muted-foreground">{config.desc}</p>
                      </div>
                      <Switch checked={value} onCheckedChange={v => setNotifications(prev => ({ ...prev, [key]: v }))} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeSection === "ai" && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-bold text-foreground">AI Configuration</h2>
                <p className="text-xs text-muted-foreground">Configure AI agent behavior and human oversight rules</p>
              </div>
              <div className="space-y-3">
                {[
                  { key: "autoGenerateReports", label: "Auto-Generate Reports", desc: "AI automatically creates reports on schedule" },
                  { key: "proactiveInsights", label: "Proactive Insights", desc: "AI surfaces insights before you ask" },
                  { key: "humanInLoop", label: "Human in the Loop", desc: "Require approval for all AI actions (recommended)" },
                  { key: "autoApproveBelow", label: "Auto-Approve Low Risk", desc: "Skip approval for AI actions below confidence threshold" },
                ].map(setting => (
                  <div key={setting.key} className="flex items-center justify-between p-3 rounded-lg border border-border/40 bg-muted">
                    <div>
                      <p className="text-sm font-medium text-foreground">{setting.label}</p>
                      <p className="text-xs text-muted-foreground">{setting.desc}</p>
                    </div>
                    <Switch
                      checked={aiSettings[setting.key as keyof typeof aiSettings] as boolean}
                      onCheckedChange={v => setAiSettings(prev => ({ ...prev, [setting.key]: v }))}
                    />
                  </div>
                ))}
                <div className="p-3 rounded-lg border border-primary/20 bg-primary/5">
                  <p className="text-sm font-medium text-primary mb-1">AI Models Active</p>
                  <div className="space-y-1.5">
                    {["GPT-4o (Primary)", "Claude 3.5 Sonnet (Secondary)", "Gemini Vision (Media Analysis)"].map(m => (
                      <div key={m} className="flex items-center gap-2 text-xs text-foreground/80">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {m}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {(activeSection === "company" || activeSection === "security" || activeSection === "data" || activeSection === "account") && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-bold text-foreground capitalize">
                  {settingsSections.find(s => s.id === activeSection)?.label} Settings
                </h2>
                <p className="text-xs text-muted-foreground">Configure {activeSection} preferences for FlowOS</p>
              </div>
              <div className="flex flex-col items-center justify-center h-48 gap-3">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                  <SettingsIcon className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  {activeSection === "security" ? "Manage passwords, 2FA, and security policies" :
                   activeSection === "company" ? "Update company name, logo, and business details" :
                   activeSection === "data" ? "Configure data retention, exports, and backups" :
                   "Billing, subscription, and account management"}
                </p>
                <Button size="sm" className="text-xs">Configure Settings</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
