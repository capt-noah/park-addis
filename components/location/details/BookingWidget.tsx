"use client";

import { Calendar, Clock, Car, ChevronDown, ArrowRight, Loader2, Info } from "lucide-react";
import { CustomCalendar } from "./CustomCalendar";
import { CustomTimePicker } from "./CustomTimePicker";

interface BookingWidgetProps {
  calculateTotal: () => number;
  calculateDuration: () => number;
  isReserving: boolean;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  arrivalTime: string;
  updateArrivalTime: (time: string) => void;
  exitTime: string;
  setExitTime: (time: string) => void;
  selectedVehicle: any;
  setSelectedVehicle: (vehicle: any) => void;
  vehicles: any[];
  spot: any;
  location: any;
  handleReserve: () => void;
  isDatePickerOpen: boolean;
  setIsDatePickerOpen: (open: boolean) => void;
  isArrivalTimePickerOpen: boolean;
  setIsArrivalTimePickerOpen: (open: boolean) => void;
  isExitTimePickerOpen: boolean;
  setIsExitTimePickerOpen: (open: boolean) => void;
  isVehicleDropdownOpen: boolean;
  setIsVehicleDropdownOpen: (open: boolean) => void;
  closeAllDropdowns: () => void;
}

export function BookingWidget({
  calculateTotal,
  calculateDuration,
  isReserving,
  selectedDate,
  setSelectedDate,
  arrivalTime,
  updateArrivalTime,
  exitTime,
  setExitTime,
  selectedVehicle,
  setSelectedVehicle,
  vehicles,
  spot,
  location,
  handleReserve,
  isDatePickerOpen,
  setIsDatePickerOpen,
  isArrivalTimePickerOpen,
  setIsArrivalTimePickerOpen,
  isExitTimePickerOpen,
  setIsExitTimePickerOpen,
  isVehicleDropdownOpen,
  setIsVehicleDropdownOpen,
  closeAllDropdowns,
}: BookingWidgetProps) {
  return (
    <div className="sticky top-20 bg-card rounded-[2.5rem] p-10 border border-border shadow-2xl shadow-primary/5 border-t-4 border-t-primary">
      <div className="flex justify-between items-center mb-10">
        <div className="space-y-1">
          <p className="text-[10px] uppercase font-primary tracking-[0.2em] font-extrabold text-muted-foreground">Total Price</p>
          <p className="text-4xl font-extrabold text-foreground">{calculateTotal().toFixed(2)} ETB</p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-extrabold border border-primary/20">
          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
          {spot?.availableSlots > 0 ? "Available Now" : "Limited Slots"}
        </div>
      </div>

      <div className="space-y-6 mb-10">
        <div className="space-y-3 relative">
          <label className="text-xs font-bold text-muted-foreground ml-1">Select Date</label>
          <div 
            onClick={() => {
              const nextState = !isDatePickerOpen;
              closeAllDropdowns();
              setIsDatePickerOpen(nextState);
            }}
            className="w-full bg-muted border border-border rounded-2xl p-4 flex justify-between items-center cursor-pointer hover:bg-muted/80 transition-colors text-sm font-bold text-foreground"
          >
            {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            <Calendar className="w-4 h-4 text-muted-foreground" />
          </div>
          {isDatePickerOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 z-50">
              <CustomCalendar 
                selectedDate={selectedDate} 
                onSelect={(date) => {
                  setSelectedDate(date);
                  setIsDatePickerOpen(false);
                }} 
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3 relative">
            <label className="text-xs font-bold text-muted-foreground ml-1">Arrive After</label>
            <div 
              onClick={() => {
                const nextState = !isArrivalTimePickerOpen;
                closeAllDropdowns();
                setIsArrivalTimePickerOpen(nextState);
              }}
              className="w-full bg-muted border border-border rounded-2xl p-4 flex justify-between items-center cursor-pointer hover:bg-muted/80 transition-colors text-sm font-bold text-foreground"
            >
              {arrivalTime}
              <Clock className="w-4 h-4 text-muted-foreground" />
            </div>
            {isArrivalTimePickerOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 z-50">
                <CustomTimePicker 
                  value={arrivalTime} 
                  onSelect={(time) => {
                    updateArrivalTime(time);
                    setIsArrivalTimePickerOpen(false);
                  }} 
                />
              </div>
            )}
          </div>
          <div className="space-y-3 relative">
            <label className="text-xs font-bold text-muted-foreground ml-1">Exit Before</label>
            <div 
              onClick={() => {
                const nextState = !isExitTimePickerOpen;
                closeAllDropdowns();
                setIsExitTimePickerOpen(nextState);
              }}
              className="w-full bg-muted border border-border rounded-2xl p-4 flex justify-between items-center cursor-pointer hover:bg-muted/80 transition-colors text-sm font-bold text-foreground"
            >
              {exitTime}
              <Clock className="w-4 h-4 text-muted-foreground" />
            </div>
            {isExitTimePickerOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 z-50">
                <CustomTimePicker 
                  value={exitTime} 
                  onSelect={(time) => {
                    setExitTime(time);
                    setIsExitTimePickerOpen(false);
                  }} 
                />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3 relative">
          <label className="text-xs font-bold text-muted-foreground ml-1">Vehicle</label>
          <div 
            onClick={() => {
              const nextState = !isVehicleDropdownOpen;
              closeAllDropdowns();
              setIsVehicleDropdownOpen(nextState);
            }}
            className="w-full bg-muted border border-border rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:bg-muted/80 transition-colors group"
          >
             <div className="w-10 h-10 bg-card rounded-xl flex items-center justify-center border border-border transition-transform group-hover:scale-105">
               <Car className="w-5 h-5 text-muted-foreground" />
             </div>
             <div className="flex-1">
                <p className="text-xs font-bold text-foreground">{selectedVehicle?.carModel || "Select Vehicle"}</p>
                <p className="text-[10px] text-muted-foreground font-medium">{selectedVehicle?.plateNumber || "No plate"}</p>
             </div>
             <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isVehicleDropdownOpen ? 'rotate-180' : ''}`} />
          </div>

          {isVehicleDropdownOpen && vehicles.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-2xl shadow-xl z-50 overflow-hidden">
              {vehicles.map((v) => (
                <div 
                  key={v.id}
                  onClick={() => {
                    setSelectedVehicle(v);
                    setIsVehicleDropdownOpen(false);
                  }}
                  className="p-4 flex items-center gap-4 hover:bg-muted transition-colors cursor-pointer border-b border-border last:border-none"
                >
                  <Car className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-xs font-bold text-foreground">{v.carModel}</p>
                    <p className="text-[10px] text-muted-foreground">{v.plateNumber}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3 py-6 border-y border-border mb-10">
         <div className="flex justify-between text-xs font-medium">
           <span className="text-muted-foreground">{calculateDuration().toFixed(1)} Hours x {spot?.pricePerHour || location.price} ETB</span>
           <span className="text-foreground font-bold">{calculateTotal().toFixed(2)} ETB</span>
         </div>
         <div className="flex justify-between text-xs font-medium">
           <span className="text-muted-foreground">Service Fee</span>
           <span className="text-primary font-bold">0 ETB</span>
         </div>
      </div>

      <button 
        onClick={handleReserve}
        disabled={isReserving || !selectedVehicle || calculateTotal() <= 0}
        className="w-full bg-primary text-white py-5 rounded-[1.5rem] font-bold text-lg text-center hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-primary/10 mb-6 flex items-center justify-center gap-2"
      >
         {isReserving ? (
           <>
             <Loader2 className="w-5 h-5 animate-spin" />
             Processing...
           </>
         ) : (
           <>
             Reserve Spot <ArrowRight className="w-5 h-5" />
           </>
         )}
      </button>

      <p className="text-center text-[10px] font-medium text-muted-foreground flex items-center justify-center gap-1.5">
         <Info className="w-3 h-3" /> Free cancellation up to 15 minutes before arrival.
      </p>
    </div>
  );
}
