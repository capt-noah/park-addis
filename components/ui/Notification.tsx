"use client";

import React from "react";
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react";

interface NotificationProps {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
}

export const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
  const config = {
    success: {
      icon: CheckCircle2,
      iconColor: "text-emerald-600 dark:text-emerald-400",
      iconBg: "bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20",
    },
    error: {
      icon: AlertCircle,
      iconColor: "text-rose-600 dark:text-rose-400",
      iconBg: "bg-rose-500/10 dark:bg-rose-500/15 border border-rose-500/20",
    },
    info: {
      icon: Info,
      iconColor: "text-primary",
      iconBg: "bg-primary/10 border border-primary/20",
    },
  }[type];

  const Icon = config.icon;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[10000] w-full max-w-sm px-4 pointer-events-none">
      <div className="bg-card/95 text-foreground border border-border/80 rounded-xl p-3 shadow-lg shadow-black/5 dark:shadow-black/20 backdrop-blur-md animate-in fade-in slide-in-from-top-3 duration-200 flex items-center justify-between gap-3 pointer-events-auto">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${config.iconBg} ${config.iconColor}`}>
            <Icon className="w-4 h-4" />
          </div>
          <p className="text-xs font-semibold text-foreground tracking-tight leading-snug truncate">
            {message}
          </p>
        </div>
        
        <button 
          type="button"
          onClick={onClose}
          aria-label="Dismiss notification"
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
