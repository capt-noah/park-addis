"use client";

import Link from "next/link";
import { Search, Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeContext";
import { useState } from "react";

export function Navbar({ userStatus }: { userStatus: boolean }) {
  const { theme, toggleTheme } = useTheme();
  const [status, setStatus] = useState(userStatus)


  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-xl">P</span>
        </div>
        <span className="text-xl font-bold tracking-tight text-primary">ParkAddis</span>
      </div>
      
      <div className="hidden md:flex items-center gap-8">
        <Link href="/locations" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          Locations
        </Link>
        <Link href="/how-it-works" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          How it Works
        </Link>
        
        <div className="flex items-center gap-4 border-l border-border pl-8">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground transition-all"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
          
          <div className="px-4 py-1 border border-primary rounded-xl" >
            <Link href={status? '/dashboard' : '/login'} className="text-sm font-semibold text-foreground hover:text-primary transition-colors">
              { status?
              "Dashboard" :" Log in "
              }
            </Link>
          </div>

        </div>

      </div>
      
      <div className="md:hidden">
        {/* Mobile menu toggle would go here */}
      </div>
    </nav>
  );
}
