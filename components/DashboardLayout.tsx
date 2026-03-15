"use client";

import { Sidebar } from "./Sidebar";
import { Search, Bell, Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeContext";

export function DashboardLayout({ children, title, user }: { children: React.ReactNode; title?: string; user?: {fullName: string, email: string, role: string, userId: string} }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <Sidebar user={user} />
      <div className="pl-60">
        {/* Top Header */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-30 font-sans transition-colors duration-300">
          <div className="w-full max-w-lg relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search for parking, locations..." 
              className="w-full bg-muted border-none rounded-xl py-2 px-10 text-xs text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 transition-all font-medium"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground transition-all"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            
            <div className="relative p-2 rounded-xl hover:bg-muted cursor-pointer transition-colors group">
              <Bell className="w-5 h-5 text-muted-foreground group-hover:text-foreground" />
              <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-card" />
            </div>
          </div>
        </header>

        <main className="p-6 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
