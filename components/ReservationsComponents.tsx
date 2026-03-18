import { MapPin, Clock, Calendar, Ticket, ChevronRight, History } from "lucide-react";
import Image from "next/image";

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

export function ReservationCard({ status, name, address, startTime, endTime, price, active, image, onViewTicket }: any) {
  const dateStr = startTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const timeStr = `${startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  
  const durationInHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
  const hours = Math.floor(durationInHours);
  const minutes = Math.round((durationInHours - hours) * 60);
  const durationStr = `${hours}h ${minutes}m`;

  return (
    <div className="bg-card rounded-3xl overflow-hidden border border-border shadow-sm flex flex-col md:flex-row h-full md:min-h-[220px] group hover:shadow-lg transition-all duration-500">
      <div className="w-full md:w-[240px] relative shrink-0 overflow-hidden bg-slate-900">
        <Image src={image} alt={name} fill className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" />
        <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-2.5 py-1 bg-card/95 backdrop-blur-md rounded-full text-[8px] font-extrabold text-foreground border border-border shadow-sm">
          <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-primary animate-pulse' : 'bg-muted-foreground'}`} />
          {status === 'ATIVE' ? 'ACTIVE' : status}
        </div>
      </div>
      
      <div className="flex-1 p-6 flex flex-col">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-foreground leading-tight">{name}</h3>
            <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] font-medium">
              <MapPin className="w-3.5 h-3.5 text-muted-foreground/60" />
              {address}
            </div>
          </div>
          <div className="text-left sm:text-right shrink-0">
             <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider mb-0.5">Estimated Price</p>
             <p className="text-2xl font-black text-primary leading-none">ETB {price}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
           <div className="p-3 bg-muted/50 rounded-2xl border border-border flex items-center gap-3 hover:bg-muted transition-colors">
              <Calendar className="w-4 h-4 text-primary/60" />
              <div className="space-y-0.5">
                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider">Date</p>
                <p className="text-[10px] font-bold text-foreground">{dateStr}</p>
              </div>
           </div>
           <div className="p-3 bg-muted/50 rounded-2xl border border-border flex items-center gap-3 hover:bg-muted transition-colors">
              <Clock className="w-4 h-4 text-primary/60" />
              <div className="space-y-0.5">
                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider">Time Slot</p>
                <p className="text-[10px] font-bold text-foreground">{timeStr}</p>
              </div>
           </div>
           <div className="p-3 bg-muted/50 rounded-2xl border border-border flex items-center gap-3 hover:bg-muted transition-colors">
              <HistoryIcon className="w-4 h-4 text-primary/60" />
              <div className="space-y-0.5">
                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider">Duration</p>
                <p className="text-[10px] font-bold text-foreground">{durationStr}</p>
              </div>
           </div>
        </div>

        <div className="mt-auto flex justify-between items-center pt-4 border-t border-border">
           {active ? (
             <div className="flex items-center gap-4 w-full justify-between">
               <button className="text-[10px] font-bold text-muted-foreground hover:text-red-500 transition-colors">Cancel Reservation</button>
               <button 
                 onClick={onViewTicket}
                 className="bg-primary text-white px-6 py-3 rounded-xl font-bold text-[10px] flex items-center gap-2 hover:opacity-90 transition-all shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95"
               >
                 <Ticket className="w-4 h-4" /> View Ticket
               </button>
             </div>
           ) : (
             <div className="flex items-center gap-4 w-full justify-end">
               <button className="bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted px-6 py-3 rounded-xl font-bold text-[10px] transition-all flex items-center gap-2">
                 View Details <ChevronRight className="w-4 h-4" />
               </button>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}

export function TicketModal({ reservation, onClose }: { reservation: any; onClose: () => void }) {
  if (!reservation) return null;

  const startTime = new Date(reservation.startTime);
  const endTime = new Date(reservation.endTime);
  const dateStr = startTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const timeStr = `${startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-[380px] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 pb-2 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-[#004D40] rounded-[0.6rem] flex items-center justify-center shadow-lg shadow-emerald-900/20">
               <span className="text-white font-black text-lg">P</span>
            </div>
            <span className="text-xl font-black tracking-tight text-[#004D40]">ParkAddis</span>
          </div>

          <div className="w-[180px] aspect-square bg-[#F8F9FA] rounded-[1.5rem] border border-slate-100 p-6 flex flex-col items-center justify-center mb-4 relative group">
             <div className="w-full h-full relative">
               <Image src="/qr-placeholder.png" alt="QR Code" fill className="object-contain" />
             </div>
          </div>
          
          <p className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase mb-2">Scan at Entrance</p>
        </div>

        {/* Perforated Line */}
        <div className="relative h-4 flex items-center">
          <div className="absolute left-0 -translate-x-1/2 w-5 h-5 bg-slate-900/40 rounded-full" />
          <div className="absolute right-0 translate-x-1/2 w-5 h-5 bg-slate-900/40 rounded-full" />
          <div className="w-full border-t-2 border-dashed border-slate-100" />
        </div>

        {/* Details - Scrollable if needed */}
        <div className="p-6 pt-4 space-y-4 overflow-y-auto scrollbar-hide">
          <div className="space-y-0.5">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Parking Location</p>
            <p className="text-sm font-black text-[#004D40] leading-tight">{reservation.locationName}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-0.5">
               <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Plate Number</p>
               <p className="text-sm font-black text-[#004D40]">ET 2-A12345</p>
             </div>
             <div className="space-y-0.5">
               <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Date</p>
               <p className="text-sm font-black text-[#004D40]">{dateStr}</p>
             </div>
          </div>

          <div className="space-y-0.5">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Time Slot</p>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#004D40]" />
              <p className="text-sm font-black text-[#004D40]">{timeStr}</p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-50 flex justify-between items-center">
            <div className="space-y-0.5">
               <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Total Price</p>
               <p className="text-xl font-black text-primary">ETB {reservation.pricePerHour}</p>
            </div>
            <div className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[8px] font-black border border-emerald-100 uppercase tracking-wide">
               Paid
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-full bg-[#0F172A] text-white py-4 rounded-2xl font-black text-xs tracking-wide hover:opacity-90 transition-all shadow-lg shadow-slate-900/20 active:scale-95 mt-2"
          >
            Close Ticket
          </button>
        </div>
      </div>
    </div>
  );
}

function HistoryIcon({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M12 8v4l3 3" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}
