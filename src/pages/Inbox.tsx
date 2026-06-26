import { useState } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Mail, Phone, MessageSquare, Bell, FileText, Mic,
  Sparkles, CheckCircle, X, Edit, ChevronRight, ChevronLeft,
  Search, Clock, User, FolderKanban,
  RefreshCw, MoreHorizontal
} from "lucide-react";
import { inboxItems } from "@/lib/data";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const typeIcons = {
  email: Mail,
  whatsapp: MessageSquare,
  meeting: Clock,
  invoice: FileText,
  notification: Bell,
  phone: Phone,
  sms: MessageSquare,
  voicenote: Mic,
};

const typeColors = {
  email: "bg-blue-500/15 text-blue-400",
  whatsapp: "bg-emerald-500/15 text-emerald-400",
  meeting: "bg-purple-500/15 text-purple-400",
  invoice: "bg-orange-500/15 text-orange-400",
  notification: "bg-red-500/15 text-red-400",
};

const filterTabs = ["All", "Emails", "WhatsApp", "Meetings", "Invoices", "Alerts"];

interface InboxProps {
  onNavigate: (page: string) => void;
}

export function Inbox({ onNavigate }: InboxProps) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedItem, setSelectedItem] = useState(inboxItems[0]);
  const [search, setSearch] = useState("");
  const [approvedItems, setApprovedItems] = useState<Set<string>>(new Set());
  const [rejectedItems, setRejectedItems] = useState<Set<string>>(new Set());
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);
  const isMobile = useIsMobile();

  const filtered = inboxItems.filter(item => {
    const matchSearch = item.subject.toLowerCase().includes(search.toLowerCase()) ||
      item.sender.toLowerCase().includes(search.toLowerCase());
    if (activeFilter === "All") return matchSearch;
    if (activeFilter === "Emails") return item.type === "email" && matchSearch;
    if (activeFilter === "WhatsApp") return item.type === "whatsapp" && matchSearch;
    if (activeFilter === "Meetings") return item.type === "meeting" && matchSearch;
    if (activeFilter === "Invoices") return item.type === "invoice" && matchSearch;
    if (activeFilter === "Alerts") return item.type === "notification" && matchSearch;
    return matchSearch;
  });

  const handleSelectItem = (item: typeof inboxItems[0]) => {
    setSelectedItem(item);
    if (isMobile) {
      setMobileDetailOpen(true);
    }
  };

  const ItemDetail = () => (
    <>
      {/* Item Header */}
      <div className="p-4 md:p-5 border-b border-border/60">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              {isMobile && (
                <button onClick={() => { setMobileDetailOpen(false); }} className="text-muted-foreground hover:text-foreground">
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
              <Badge className={cn("text-[10px]", typeColors[selectedItem!.type as keyof typeof typeColors] || "")}>
                {selectedItem!.type}
              </Badge>
              <Badge className={cn("text-[10px] border-0",
                selectedItem!.priority === "urgent" ? "bg-red-500/20 text-red-400" :
                selectedItem!.priority === "high" ? "bg-orange-500/20 text-orange-400" :
                "bg-blue-500/20 text-blue-400"
              )}>
                {selectedItem!.priority}
              </Badge>
            </div>
            <h3 className="text-sm md:text-base font-semibold text-foreground line-clamp-2">{selectedItem!.subject}</h3>
            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1 truncate"><User className="w-3 h-3 flex-shrink-0" />{selectedItem!.sender}</span>
              <span className="hidden sm:inline">·</span>
              <span className="hidden sm:flex items-center gap-1"><FolderKanban className="w-3 h-3" />{selectedItem!.project}</span>
              <span className="flex-shrink-0">{selectedItem!.time}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button variant="ghost" size="icon" className="w-8 h-8 hidden sm:flex"><MoreHorizontal className="w-4 h-4" /></Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4 scrollbar-hide">
        {/* Original Message */}
        <div className="p-4 rounded-lg bg-muted border border-border/40">
          <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">Original Message</p>
          <p className="text-sm text-foreground/80">{selectedItem!.preview}</p>
          <p className="text-xs text-muted-foreground mt-2">...read more</p>
        </div>

        {/* AI Analysis */}
        <div className="p-4 rounded-lg border border-primary/20 bg-primary/5">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold text-primary">AI Analysis</span>
            <span className="text-[10px] text-muted-foreground ml-auto">Confidence: {selectedItem!.confidence}%</span>
          </div>
          <p className="text-sm text-foreground/80">{selectedItem!.aiSummary}</p>
        </div>

        {/* Suggested Actions */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">AI Suggested Actions</p>
          <div className="space-y-2">
            {selectedItem!.suggestedActions.map((action, i) => (
              <button
                key={i}
                className="w-full text-left flex items-center gap-2.5 p-3 rounded-lg border border-border/60 bg-card hover:border-primary/30 hover:bg-primary/5 transition-all text-sm text-foreground/80 group"
                onClick={() => onNavigate("projects")}
              >
                <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/25">
                  <span className="text-[10px] font-bold text-primary">{i + 1}</span>
                </div>
                <span className="truncate">{action}</span>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Project", value: selectedItem!.project },
            { label: "Responsible", value: "Carlos Rivera" },
            { label: "Customer", value: selectedItem!.senderCompany },
            { label: "Priority", value: selectedItem!.priority },
          ].map(m => (
            <div key={m.label} className="p-3 rounded-lg bg-muted border border-border/40 overflow-hidden">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{m.label}</p>
              <p className="text-xs font-medium text-foreground mt-0.5 truncate">{m.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Bar */}
      <div className="p-4 border-t border-border/60 flex items-center gap-2 flex-wrap">
        <Button
          size="sm"
          className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white flex-1 min-w-[120px]"
          onClick={() => {
            setApprovedItems(prev => new Set([...prev, selectedItem!.id]));
          }}
        >
          <CheckCircle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Approve</span>
          <span className="sm:hidden">OK</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 flex-1 min-w-[100px]"
          onClick={() => onNavigate("projects")}
        >
          <Edit className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Edit</span>
          <span className="sm:hidden">Edit</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 border-red-500/30 text-red-400 hover:bg-red-500/10 flex-1 min-w-[80px]"
          onClick={() => {
            setRejectedItems(prev => new Set([...prev, selectedItem!.id]));
          }}
        >
          <X className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reject</span>
        </Button>
      </div>
    </>
  );

  return (
    <div className="flex gap-4 h-[calc(100vh-8rem)]">
      {/* Left Panel */}
      <div className={cn(
        "flex flex-col gap-3",
        isMobile ? "w-full" : "w-80 flex-shrink-0"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-lg font-bold text-foreground">Inbox</h2>
            <p className="text-xs text-muted-foreground">34 unread · AI processed all items</p>
          </div>
          <Button variant="outline" size="icon" className="w-8 h-8">
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Search messages..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-8 h-8 text-xs"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-1 overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          {filterTabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={cn(
                "flex-shrink-0 text-[11px] px-2.5 py-1 rounded-md transition-all",
                activeFilter === tab
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto space-y-2 scrollbar-hide">
          {filtered.map(item => {
            const Icon = typeIcons[item.type as keyof typeof typeIcons] || Bell;
            const isApproved = approvedItems.has(item.id);
            const isRejected = rejectedItems.has(item.id);
            return (
              <div
                key={item.id}
                onClick={() => handleSelectItem(item)}
                className={cn(
                  "p-3 rounded-lg border cursor-pointer transition-all",
                  selectedItem.id === item.id
                    ? "border-primary/40 bg-primary/8"
                    : "border-border/60 bg-card hover:border-border hover:bg-muted",
                  !item.read && "border-l-2 border-l-primary"
                )}
              >
                <div className="flex items-start gap-2.5">
                  <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5", typeColors[item.type as keyof typeof typeColors] || "bg-muted text-muted-foreground")}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className={cn("text-xs font-medium truncate", !item.read ? "text-foreground" : "text-muted-foreground")}>{item.sender}</p>
                      <span className="text-[10px] text-muted-foreground flex-shrink-0">{item.time}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate mt-0.5">{item.subject}</p>
                    <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                      <Badge className={cn("text-[9px] h-4 px-1 border-0",
                        item.priority === "urgent" ? "bg-red-500/20 text-red-400" :
                        item.priority === "high" ? "bg-orange-500/20 text-orange-400" :
                        "bg-blue-500/20 text-blue-400"
                      )}>
                        {item.priority}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground hidden sm:inline">AI {item.confidence}%</span>
                      {isApproved && <Badge className="text-[9px] h-4 px-1 bg-emerald-500/20 text-emerald-400 border-0">Approved</Badge>}
                      {isRejected && <Badge className="text-[9px] h-4 px-1 bg-red-500/20 text-red-400 border-0">Rejected</Badge>}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Item Detail - Desktop */}
      {!isMobile && (
        <Card className="flex-1 glass-subtle border-border/60 flex flex-col overflow-hidden">
          {selectedItem ? (
            <ItemDetail />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-muted-foreground text-sm">Select a message to view</p>
            </div>
          )}
        </Card>
      )}

      {/* Item Detail - Mobile Sheet */}
      {isMobile && selectedItem && (
        <Sheet open={mobileDetailOpen} onOpenChange={(open) => { setMobileDetailOpen(open); if (!open) setSelectedItem(inboxItems[0]); }}>
          <SheetContent side="bottom" className="h-[90vh] rounded-t-2xl p-0 flex flex-col">
            <SheetHeader className="px-4 pt-4 pb-2 border-b border-border/60">
              <SheetTitle className="text-left truncate pr-8">{selectedItem?.subject}</SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-hidden">
              <Card className="h-full border-0 shadow-none flex flex-col overflow-hidden bg-transparent">
                <ItemDetail />
              </Card>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}
