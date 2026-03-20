import React from "react";

export function AmenityItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-4 bg-muted/30 border border-border p-4 rounded-2xl hover:bg-card hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
      <div className="w-10 h-10 bg-card rounded-xl flex items-center justify-center shadow-sm border border-border">
        {icon}
      </div>
      <span className="text-sm font-bold text-foreground tracking-tight">{label}</span>
    </div>
  );
}
