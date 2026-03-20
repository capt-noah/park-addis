import { CheckCircle2 } from "lucide-react";

export function RuleItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3 group">
      <div className="w-5 h-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
        <CheckCircle2 className="w-3 h-3 text-primary" />
      </div>
      <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{text}</span>
    </li>
  );
}
