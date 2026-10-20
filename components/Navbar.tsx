"use client";

import Link from "next/link";
import { Sun, Moon, ArrowRight } from "lucide-react";
import { useTheme } from "./ThemeContext";
import { useState } from "react";

export function Navbar({ userStatus }: { userStatus: boolean }) {
  const { theme, toggleTheme } = useTheme();
  const [status] = useState(userStatus);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3.5 bg-background/85 backdrop-blur-xl border-b border-border/70 transition-colors">
      <Link href="/" className="flex items-center gap-2.5 group">
        <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
          <span className="text-white font-extrabold text-lg">P</span>
        </div>
        <span className="text-lg font-black tracking-tight text-primary">ParkAddis</span>
      </Link>
      
      <div className="hidden md:flex items-center gap-7">
        <Link href="/locations" className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors">
          Locations Map
        </Link>
        <Link href="/#features" className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors">
          Infrastructure
        </Link>
        <Link href="/wallet" className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors">
          Digital Wallet
        </Link>
        
        <div className="flex items-center gap-3 border-l border-border/80 pl-6">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-muted/70 hover:bg-muted text-foreground transition-all active:scale-95"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
          </button>
          
          <Link 
            href={status ? "/dashboard" : "/login"} 
            className="text-xs font-bold px-4 py-2 rounded-xl bg-primary text-white hover:opacity-95 active:scale-[0.98] transition-all shadow-sm shadow-primary/20"
          >
            {status ? "Dashboard" : "Log In"}
          </Link>
        </div>
      </div>
      
      <div className="flex md:hidden items-center gap-2">
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-muted/70 hover:bg-muted text-foreground transition-all"
          aria-label="Toggle theme"
        >
          {theme === "light" ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
        </button>
        <Link 
          href={status ? "/dashboard" : "/login"} 
          className="text-xs font-bold px-3.5 py-1.5 rounded-xl bg-primary text-white"
        >
          {status ? "Dashboard" : "Log In"}
        </Link>
      </div>
    </nav>
  );
}
