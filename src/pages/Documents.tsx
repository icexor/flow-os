import { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search, Plus, Upload, FileText, File, Image, Table,
  Sparkles, Download, Eye, Clock, User, FolderKanban,
  CheckCircle, AlertCircle, MoreHorizontal
} from "lucide-react";
import { documents } from "@/lib/data";

const docTypeIcon = {
  pdf: FileText,
  word: File,
  excel: Table,
  image: Image,
};

const docTypeColor = {
  pdf: "bg-red-500/15 text-red-400",
  word: "bg-blue-500/15 text-blue-400",
  excel: "bg-emerald-500/15 text-emerald-400",
  image: "bg-purple-500/15 text-purple-400",
};

const statusConfig = {
  approved: { badge: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", icon: CheckCircle },
  active: { badge: "bg-blue-500/20 text-blue-400 border-blue-500/30", icon: CheckCircle },
  "pending-approval": { badge: "bg-orange-500/20 text-orange-400 border-orange-500/30", icon: AlertCircle },
  draft: { badge: "bg-muted text-muted-foreground", icon: Clock },
};

const categories = ["All", "Engineering", "Legal", "Compliance", "Change Order", "Invoices", "Drawings"];

interface DocumentsProps {
  onNavigate?: (page: string) => void;
}

const allDocs = [
  ...documents,
  {
    id: "doc5", name: "TechPark Phase 4 - LEED Certification Application",
    type: "pdf", size: "3.1 MB", uploadedBy: "Marcus Webb", uploadedAt: "2024-06-15",
    project: "TechPark Phase 4 Campus", customer: "TechPark Realty Trust",
    tags: ["leed", "certification", "sustainability"],
    aiSummary: "LEED Platinum application submitted. 87/110 points achieved. Pending documentation: 3 energy reports.",
    status: "pending-approval", category: "Compliance",
  },
  {
    id: "doc6", name: "Harborview Marina - Foundation Inspection Report",
    type: "pdf", size: "6.7 MB", uploadedBy: "Tom Bradley", uploadedAt: "2024-06-22",
    project: "Harborview Marina Complex", customer: "Harborview Developments",
    tags: ["inspection", "foundation", "approved"],
    aiSummary: "Foundation inspection passed with minor observations. 2 items require follow-up within 30 days. Critical path not impacted.",
    status: "approved", category: "Engineering",
  },
];

export function Documents({ }: DocumentsProps) {
  const [selectedDoc, setSelectedDoc] = useState<typeof allDocs[0] | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = allDocs.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "All" || d.category === category;
    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-foreground">Documents</h2>
          <p className="text-xs text-muted-foreground">{allDocs.length} documents · AI processed with OCR · Smart tagging active</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8">
            <Upload className="w-3 h-3" /> <span className="hidden sm:inline">Upload</span>
          </Button>
          <Button size="sm" className="gap-1.5 text-xs h-8">
            <Plus className="w-3.5 h-3.5" /> <span className="hidden sm:inline">New</span>
          </Button>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
          <Input placeholder="Search documents..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-8 text-xs" />
        </div>
        <div className="flex gap-1 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                "flex-shrink-0 text-[11px] px-2.5 py-1 rounded-md transition-all",
                category === cat ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-4 flex-col lg:flex-row">
        {/* Document Grid */}
        <div className={cn("grid gap-3 flex-1", selectedDoc ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3")}>
          {filtered.map(doc => {
            const Icon = docTypeIcon[doc.type as keyof typeof docTypeIcon] || FileText;
            const status = statusConfig[doc.status as keyof typeof statusConfig];
            const StatusIcon = status?.icon || CheckCircle;
            return (
              <div
                key={doc.id}
                onClick={() => setSelectedDoc(doc)}
                className={cn(
                  "p-3 md:p-4 rounded-lg border cursor-pointer transition-all",
                  selectedDoc?.id === doc.id
                    ? "border-primary/40 bg-primary/8"
                    : "border-border/60 bg-card hover:border-border hover:bg-muted"
                )}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className={cn("w-9 h-9 md:w-10 md:h-10 rounded-lg flex items-center justify-center flex-shrink-0", docTypeColor[doc.type as keyof typeof docTypeColor] || "bg-muted text-muted-foreground")}>
                    <Icon className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground line-clamp-2">{doc.name}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{doc.size} · {doc.uploadedAt}</p>
                  </div>
                  <button className="text-muted-foreground hover:text-foreground hidden sm:block" onClick={e => e.stopPropagation()}>
                    <MoreHorizontal className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-[10px] text-muted-foreground line-clamp-2 mb-2">{doc.aiSummary}</p>

                <div className="flex items-center justify-between flex-wrap gap-1">
                  <Badge className={cn("text-[9px] h-4 px-1 border", status?.badge || "bg-muted text-muted-foreground")}>
                    <StatusIcon className="w-2.5 h-2.5 mr-1" />
                    {doc.status}
                  </Badge>
                  <div className="flex items-center gap-1">
                    {doc.tags.slice(0, 2).map(tag => (
                      <Badge key={tag} variant="outline" className="text-[8px] h-4 px-1">{tag}</Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground flex-wrap">
                  <span className="flex items-center gap-0.5 truncate"><User className="w-2.5 h-2.5 flex-shrink-0" />{doc.uploadedBy}</span>
                  <span className="flex items-center gap-0.5 truncate hidden sm:flex"><FolderKanban className="w-2.5 h-2.5 flex-shrink-0" />{doc.project.substring(0, 15)}...</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Document Detail Panel - Desktop */}
        {selectedDoc && (
          <Card className="w-full lg:w-72 flex-shrink-0 glass-subtle border-border/60 flex flex-col h-fit hidden lg:flex">
            <CardHeader className="pb-2 pt-4 px-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-foreground">Document Preview</CardTitle>
                <button onClick={() => setSelectedDoc(null)} className="text-muted-foreground hover:text-foreground text-xs">X</button>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-3">
              {/* Preview */}
              <div className="aspect-[3/4] rounded-lg bg-muted border border-border/40 flex items-center justify-center">
                <div className="text-center">
                  <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Preview</p>
                </div>
              </div>

              {/* AI Summary */}
              <div className="p-3 rounded-lg border border-primary/20 bg-primary/5">
                <div className="flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-3 h-3 text-primary" />
                  <span className="text-[10px] font-semibold text-primary">AI Summary</span>
                </div>
                <p className="text-[11px] text-foreground/80">{selectedDoc.aiSummary}</p>
              </div>

              <div className="space-y-2">
                {[
                  { label: "Category", value: selectedDoc.category },
                  { label: "Project", value: selectedDoc.project.substring(0, 25) + "..." },
                  { label: "Customer", value: selectedDoc.customer },
                  { label: "Uploaded by", value: selectedDoc.uploadedBy },
                  { label: "Date", value: selectedDoc.uploadedAt },
                ].map(m => (
                  <div key={m.label} className="flex justify-between">
                    <span className="text-[10px] text-muted-foreground">{m.label}</span>
                    <span className="text-[10px] font-medium text-foreground text-right truncate ml-2">{m.value}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Button size="sm" className="flex-1 text-xs h-7 gap-1">
                  <Eye className="w-3 h-3" /> View
                </Button>
                <Button variant="outline" size="sm" className="flex-1 text-xs h-7 gap-1">
                  <Download className="w-3 h-3" /> Download
                </Button>
              </div>

              {selectedDoc.status === "pending-approval" && (
                <Button size="sm" className="w-full text-xs h-7 bg-emerald-600 hover:bg-emerald-700 text-white gap-1">
                  <CheckCircle className="w-3 h-3" /> Approve Document
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
