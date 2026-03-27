"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function CustomCalendar({ selectedDate, onSelect }: { selectedDate: Date; onSelect: (date: Date) => void }) {
  const [viewDate, setViewDate] = useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  
  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();
  
  const prevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const nextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  
  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="h-10" />);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(viewDate.getFullYear(), viewDate.getMonth(), i);
    const isSelected = d.toDateString() === selectedDate.toDateString();
    
    days.push(
      <button
        key={i}
        onClick={() => onSelect(d)}
        className={`h-10 w-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${
          isSelected 
            ? "bg-black text-white shadow-lg" 
            : "text-foreground hover:bg-primary hover:text-white"
        }`}
      >
        {i}
      </button>
    );
  }

  return (
    <div className="bg-card border border-border rounded-[2rem] p-6 shadow-2xl w-full max-w-[320px] mx-auto overflow-hidden">
      <div className="flex justify-between items-center mb-6 px-2">
        <button onClick={prevMonth} className="p-2 hover:bg-muted rounded-full transition-colors">
          <ChevronDown className="w-4 h-4 rotate-90" />
        </button>
        <h3 className="font-extrabold text-foreground tracking-tight">
          {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
        </h3>
        <button onClick={nextMonth} className="p-2 hover:bg-muted rounded-full transition-colors">
          <ChevronDown className="w-4 h-4 -rotate-90" />
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {daysOfWeek.map(day => (
          <span key={day} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
            {day}
          </span>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {days}
      </div>
    </div>
  );
}
