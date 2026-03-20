"use client";

export function TabItem({ label, count, active, onClick }: { label: string; count?: number; active?: boolean; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 pb-4 text-sm font-bold transition-all relative ${
        active ? "text-primary" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
      {count !== undefined && (
        <span className={`px-2 py-0.5 rounded-lg text-[10px] ${
          active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
        }`}>
          {count}
        </span>
      )}
      {active && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />
      )}
    </button>
  );
}
