"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, CalendarDays, User, Settings, LogOut, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { useSession } from "@/components/session/AppSessionProvider";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: MapPin, label: "Locations", href: "/locations" },
  { icon: CalendarDays, label: "My Reservations", href: "/reservations", badge: true },
  { icon: User, label: "Profile", href: "/profile" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar({ user }: { user?: {userId: string, fullName: string, email: string, role: string} }) {
  const pathname = usePathname();
  const router = useRouter();
  const { activeReservation, isSidebarCollapsed, setIsSidebarCollapsed } = useSession();

  const onToggle = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  const handleLogout = async () => {
    const response = await fetch('/api/logout')
    const data = await response.json()
    if (!data.ok) console.log('unable to logout')
    router.replace('/')
  }

  return (
    <aside className={`${isSidebarCollapsed ? "w-20" : "w-60"} border-r border-border bg-card h-screen fixed left-0 top-0 z-40 flex flex-col transition-all duration-300 overflow-hidden`}>
      <div className={`flex ${isSidebarCollapsed ? "flex-col gap-4 py-6" : "flex-row justify-between p-6"} mb-2 items-center`}>
        <Link href="/" className="flex items-center gap-2 overflow-hidden shrink-0">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          {!isSidebarCollapsed && <span className="text-lg font-bold tracking-tight text-primary">ParkAddis</span>}
        </Link>
        <button 
          onClick={onToggle}
          className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all shrink-0"
        >
          {isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <div className="flex-1 px-3 space-y-0.5">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const showBadge = item.badge && activeReservation;

          return (
            <Link
              key={item.href}
              href={item.href}
              title={isSidebarCollapsed ? item.label : undefined}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                isActive 
                ? "bg-primary/10 text-primary font-bold" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
              } ${isSidebarCollapsed ? "justify-center" : ""}`}
            >
              <item.icon className={`w-4 h-4 shrink-0 ${isActive ? "text-primary" : "group-hover:text-foreground"}`} />
              {!isSidebarCollapsed && <span className="text-xs">{item.label}</span>}
              {!isSidebarCollapsed && showBadge && (
                <div className="ml-auto flex items-center gap-1.5">
                   <div className="w-2 h-2 bg-primary rounded-full shadow-sm" />
                </div>
              )}
              {isSidebarCollapsed && showBadge && (
                <div className="absolute top-3 right-5 w-2 h-2 bg-primary rounded-full shadow-sm" />
              )}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-border">
        <button onClick={handleLogout} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-red-500/10 hover:text-red-500 transition-colors group w-full ${isSidebarCollapsed ? "justify-center" : ""}`}>
          <LogOut className="w-4 h-4 text-muted-foreground group-hover:text-red-500 shrink-0" />
          {!isSidebarCollapsed && <span className="text-xs font-bold">Log out</span>}
        </button>
        
        <div className={`mt-4 pt-4 border-t border-border flex items-center gap-3 px-1 ${isSidebarCollapsed ? "justify-center" : ""}`}>
          <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center overflow-hidden border border-border flex-shrink-0">
            <User className="w-4 h-4 text-muted-foreground" />
          </div>
          {!isSidebarCollapsed && (
            <div className="min-w-0 flex-1">
              {user ? (
                <>
                  <p className="text-[10px] font-bold text-foreground truncate">{ user.fullName }</p>
                  <p className="text-[9px] text-muted-foreground truncate">{ user.email }</p>
                </>
              ) : (
                <>
                  <div className="h-3 w-20 bg-muted animate-pulse rounded mb-1" />
                  <div className="h-2 w-24 bg-muted animate-pulse rounded" />
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
