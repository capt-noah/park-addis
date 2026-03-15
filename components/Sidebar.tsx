"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Search, CalendarDays, User, Settings, LogOut } from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: CalendarDays, label: "My Reservations", href: "/reservations" },
  { icon: User, label: "Profile", href: "/profile" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar({ user }: {user?: {userId: string, fullName: string, email: string, role: string}}) {
  const pathname = usePathname();
  const router = useRouter()


  const handleLogout = async () => {

    const response = await fetch('/api/logout')

    const data = await response.json()

    if (!data.ok) console.log('unable to logout')
    
    router.replace('/')
  }

  return (
    <aside className="w-60 border-r border-border bg-card h-screen fixed left-0 top-0 z-40 flex flex-col transition-colors duration-300">
      <div className="p-6 mb-2">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-primary">ParkAddis</span>
        </Link>
      </div>

      <div className="flex-1 px-3 space-y-0.5">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                ? "bg-primary/10 text-primary font-bold" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className={`w-4 h-4 ${isActive ? "text-primary" : "group-hover:text-foreground"}`} />
              <span className="text-xs">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1 h-1 bg-primary rounded-full" />
              )}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-border">
        <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-red-500/10 hover:text-red-500 transition-colors group">
          <LogOut className="w-4 h-4 text-muted-foreground group-hover:text-red-500" />
          <span className="text-xs font-bold">Log out</span>
        </button>
        
        <div className="mt-4 pt-4 border-t border-border flex items-center gap-3 px-1">
          <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center overflow-hidden border border-border flex-shrink-0">
            <User className="w-4 h-4 text-muted-foreground" />
          </div>
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
        </div>
      </div>
    </aside>
  );
}
