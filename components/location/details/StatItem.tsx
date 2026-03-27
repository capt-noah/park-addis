export function StatItem({ label, value, sub, active }: { label: string; value: string; sub?: string; active?: boolean }) {
  return (
    <div className="bg-card border border-border rounded-[1.5rem] p-6 shadow-sm hover:shadow-md transition-all">
       <p className="text-[10px] uppercase font-primary tracking-widest font-extrabold text-muted-foreground mb-2">{label}</p>
       <div className="flex items-baseline gap-1">
          <p className={`text-xl font-bold ${active ? 'text-primary' : 'text-foreground'}`}>
             {active && <span className="inline-block w-2 h-2 bg-primary rounded-full mr-2 mb-0.5" />}
             {value}
          </p>
          {sub && <span className="text-[10px] font-medium text-muted-foreground">{sub}</span>}
       </div>
    </div>
  );
}
