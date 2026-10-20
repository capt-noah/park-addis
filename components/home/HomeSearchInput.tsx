"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, ArrowRight } from "lucide-react";

export function HomeSearchInput() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/locations?selected=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/locations");
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="w-full max-w-xl bg-card/90 dark:bg-card/80 backdrop-blur-xl p-1.5 rounded-2xl border border-border/80 shadow-xl shadow-primary/5 flex items-center gap-2 group focus-within:border-primary/50 transition-all duration-200"
    >
      <div className="flex-1 flex items-center px-3 gap-3 min-w-0">
        <Search className="w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Where are you heading in Addis Ababa?"
          className="w-full bg-transparent border-none focus:outline-none text-foreground text-sm font-medium placeholder:text-muted-foreground/70 truncate"
        />
      </div>
      <button
        type="submit"
        className="bg-primary text-white text-xs font-bold px-5 py-3 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-1.5 shadow-md shadow-primary/20 shrink-0"
      >
        <span>Search</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </form>
  );
}
