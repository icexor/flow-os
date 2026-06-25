import { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Camera, Sparkles, Upload, Eye, Download, ZoomIn,
  Image as ImageIcon, AlertTriangle,
  Play, Grid3X3
} from "lucide-react";

const mediaItems = [
  { id: "m1", type: "photo", title: "Downtown Tower - Floor 28 Progress", project: "Downtown Mixed-Use Tower", date: "2024-06-23", tags: ["progress", "structural"], aiTags: ["concrete-pour", "rebar-visible", "workers-present"], confidence: 96, flagged: false, size: "4.2 MB" },
  { id: "m2", type: "photo", title: "Marina Complex - Foundation Section A", project: "Harborview Marina Complex", date: "2024-06-22", tags: ["foundation", "inspection"], aiTags: ["crack-detected", "water-seepage"], confidence: 89, flagged: true, size: "3.8 MB" },
  { id: "m3", type: "drone", title: "TechPark Phase 4 - Aerial Overview", project: "TechPark Phase 4 Campus", date: "2024-06-21", tags: ["aerial", "overview"], aiTags: ["progress-tracking", "site-layout"], confidence: 97, flagged: false, size: "18.4 MB" },
  { id: "m4", type: "video", title: "I-70 Interchange - Paving Time-lapse", project: "I-70 Highway Interchange", date: "2024-06-20", tags: ["paving", "timelapse"], aiTags: ["quality-work", "on-schedule"], confidence: 94, flagged: false, size: "245 MB" },
  { id: "m5", type: "photo", title: "Pinnacle Resort - Lobby Renovation", project: "Pinnacle Resort Renovation", date: "2024-06-19", tags: ["interior", "renovation"], aiTags: ["incomplete-work", "materials-missing"], confidence: 91, flagged: true, size: "5.1 MB" },
  { id: "m6", type: "photo", title: "Downtown Tower - Safety Equipment Check", project: "Downtown Mixed-Use Tower", date: "2024-06-18", tags: ["safety", "equipment"], aiTags: ["ppe-compliant", "scaffolding-secure"], confidence: 99, flagged: false, size: "2.9 MB" },
];

const aiCapabilities = [
  { name: "Object Detection", desc: "Equipment, materials, workers", active: true },
  { name: "Damage Detection", desc: "Cracks, defects, safety issues", active: true },
  { name: "Progress Tracking", desc: "Compare vs schedule", active: true },
  { name: "Duplicate Detection", desc: "Remove redundant media", active: true },
  { name: "Auto Tagging", desc: "Smart metadata generation", active: true },
  { name: "Video Summaries", desc: "AI-generated highlights", active: false },
];

interface MediaProps {
  onNavigate?: (page: string) => void;
}

export function Media({ }: MediaProps) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedMedia, setSelectedMedia] = useState<typeof mediaItems[0] | null>(null);

  const filters = [
    { id: "all", label: "All Media" },
    { id: "photo", label: "Photos" },
    { id: "video", label: "Videos" },
    { id: "drone", label: "Drone" },
    { id: "flagged", label: "Flagged" },
  ];

  const filtered = mediaItems.filter(m => {
    if (activeFilter === "all") return true;
    if (activeFilter === "flagged") return m.flagged;
    return m.type === activeFilter;
  });

  const typeColors: Record<string, string> = {
    photo: "bg-blue-500/15 text-blue-400",
    video: "bg-purple-500/15 text-purple-400",
    drone: "bg-emerald-500/15 text-emerald-400",
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">Media Center</h2>
          <p className="text-xs text-muted-foreground">847 photos · 23 videos · 12 drone files · AI analysis active</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8"><Upload className="w-3 h-3" />Upload</Button>
          <Button size="sm" className="gap-1.5 text-xs h-8"><Sparkles className="w-3 h-3" />AI Analysis</Button>
        </div>
      </div>

      {/* AI Capabilities */}
      <Card className="glass-subtle border-border/60">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold text-foreground">AI Visual Intelligence</span>
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]">Active</Badge>
          </div>
          <div className="grid grid-cols-6 gap-2">
            {aiCapabilities.map(cap => (
              <div key={cap.name} className={cn("p-2.5 rounded-lg border text-center", cap.active ? "border-primary/20 bg-primary/5" : "border-border/40 bg-muted opacity-60")}>
                <div className={cn("w-2 h-2 rounded-full mx-auto mb-1.5", cap.active ? "bg-emerald-500" : "bg-muted-foreground")} />
                <p className="text-[10px] font-medium text-foreground">{cap.name}</p>
                <p className="text-[9px] text-muted-foreground">{cap.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alert Banner */}
      {mediaItems.some(m => m.flagged) && (
        <div className="flex items-center gap-3 p-3 rounded-lg border border-red-500/30 bg-red-500/10">
          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <p className="text-sm text-foreground">
            <span className="font-semibold text-red-400">AI Alert: </span>
            2 media items flagged for review — potential structural issue at Marina Complex foundation.
          </p>
          <Button size="sm" variant="outline" className="ml-auto text-xs h-7 border-red-500/30 text-red-400 hover:bg-red-500/10 flex-shrink-0">
            Review
          </Button>
        </div>
      )}

      {/* Filter + Grid */}
      <div className="flex items-center gap-3">
        <div className="flex gap-1">
          {filters.map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={cn(
                "text-[11px] px-2.5 py-1 rounded-md transition-all",
                activeFilter === f.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-7 text-xs gap-1"><Grid3X3 className="w-3 h-3" />Grid</Button>
        </div>
      </div>

      <div className="flex gap-4">
        {/* Media Grid */}
        <div className="flex-1 grid grid-cols-3 gap-3">
          {filtered.map(media => (
            <div
              key={media.id}
              onClick={() => setSelectedMedia(media)}
              className={cn(
                "rounded-lg border overflow-hidden cursor-pointer transition-all hover:border-primary/40 group",
                selectedMedia?.id === media.id ? "border-primary/40" : "border-border/60",
                media.flagged && "ring-1 ring-red-500/40"
              )}
            >
              {/* Thumbnail */}
              <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 relative flex items-center justify-center">
                {media.type === "video" ? (
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                    <Play className="w-5 h-5 text-white" />
                  </div>
                ) : media.type === "drone" ? (
                  <div className="text-center">
                    <Camera className="w-8 h-8 text-muted-foreground/40 mx-auto" />
                    <p className="text-[9px] text-muted-foreground mt-1">Drone Footage</p>
                  </div>
                ) : (
                  <ImageIcon className="w-8 h-8 text-muted-foreground/40" />
                )}
                {media.flagged && (
                  <div className="absolute top-1.5 left-1.5 flex items-center gap-1 bg-red-500/80 text-white text-[9px] px-1.5 py-0.5 rounded">
                    <AlertTriangle className="w-2.5 h-2.5" />
                    Flagged
                  </div>
                )}
                <div className={cn("absolute top-1.5 right-1.5 text-[9px] px-1.5 py-0.5 rounded font-medium", typeColors[media.type] || "bg-muted text-muted-foreground")}>
                  {media.type}
                </div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <ZoomIn className="w-5 h-5 text-white" />
                  <Eye className="w-5 h-5 text-white" />
                </div>
              </div>

              <div className="p-2.5">
                <p className="text-[11px] font-medium text-foreground line-clamp-1">{media.title}</p>
                <p className="text-[10px] text-muted-foreground">{media.project.substring(0, 25)}...</p>
                <div className="flex items-center gap-1 mt-1.5">
                  {media.aiTags.slice(0, 2).map(tag => (
                    <Badge key={tag} className={cn("text-[8px] h-3.5 px-1 border-0", media.flagged && tag.includes("crack") || tag.includes("missing") ? "bg-red-500/20 text-red-400" : "bg-primary/15 text-primary")}>
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-1 text-[9px] text-muted-foreground">
                  <span>{media.date}</span>
                  <span>AI {media.confidence}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detail Panel */}
        {selectedMedia && (
          <Card className="w-64 flex-shrink-0 glass-subtle border-border/60">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">Details</span>
                <button onClick={() => setSelectedMedia(null)} className="text-muted-foreground hover:text-foreground text-xs">✕</button>
              </div>

              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-muted-foreground/30" />
              </div>

              <div>
                <p className="text-xs font-medium text-foreground">{selectedMedia.title}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{selectedMedia.project}</p>
              </div>

              <div className="p-3 rounded-lg border border-primary/20 bg-primary/5">
                <div className="flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-3 h-3 text-primary" />
                  <span className="text-[10px] font-semibold text-primary">AI Detection ({selectedMedia.confidence}%)</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {selectedMedia.aiTags.map(tag => (
                    <Badge key={tag} className={cn("text-[9px] h-4 px-1 border-0",
                      selectedMedia.flagged && (tag.includes("crack") || tag.includes("missing") || tag.includes("seepage"))
                        ? "bg-red-500/20 text-red-400" : "bg-primary/15 text-primary"
                    )}>
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                {[
                  { label: "Type", value: selectedMedia.type },
                  { label: "Date", value: selectedMedia.date },
                  { label: "Size", value: selectedMedia.size },
                ].map(m => (
                  <div key={m.label} className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{m.label}</span>
                    <span className="text-foreground font-medium">{m.value}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Button size="sm" className="flex-1 text-xs h-7 gap-1"><Eye className="w-3 h-3" />View</Button>
                <Button variant="outline" size="sm" className="flex-1 text-xs h-7 gap-1"><Download className="w-3 h-3" />Save</Button>
              </div>

              {selectedMedia.flagged && (
                <Button size="sm" className="w-full text-xs h-7 bg-red-600 hover:bg-red-700 text-white gap-1">
                  <AlertTriangle className="w-3 h-3" /> Review Issue
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
