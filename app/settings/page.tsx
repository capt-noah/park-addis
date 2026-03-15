import { DashboardLayout } from "@/components/DashboardLayout";
import { findUserBySession } from "@/src/services/auth.service";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Lock, Bell, Search, ShieldAlert, ChevronRight, ChevronDown, Globe, Mail, Smartphone, Info } from "lucide-react";

export default async function SettingsPage() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get("sessionId")?.value
  if (!sessionId) redirect("/login")
  const dbUser = await findUserBySession(sessionId)
  if (!dbUser) redirect("/login")
  const user = { userId: dbUser.id, fullName: dbUser.fullName, email: dbUser.email, role: dbUser.role ?? "user" }

  return (
    <DashboardLayout user={user} >
      <div className="mb-10">
        <h1 className="text-2xl font-extrabold text-primary mb-1">Account Settings</h1>
        <p className="text-muted-foreground text-xs font-medium tracking-tight">Manage your account preferences and security.</p>
      </div>

      <div className="space-y-8 max-w-5xl">
        {/* Security Section */}
        <div className="bg-card rounded-[2rem] border border-border shadow-sm overflow-hidden transition-colors">
          <div className="p-6 border-b border-border flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
               <Lock className="w-4 h-4 text-primary" />
             </div>
             <div>
               <h3 className="font-bold text-foreground text-sm">Security & Login</h3>
               <p className="text-[10px] text-muted-foreground font-medium">Update your password and secure your account.</p>
             </div>
          </div>
          
          <div className="p-8 space-y-8">
            <div className="max-w-md space-y-3">
              <label className="text-[11px] font-bold text-muted-foreground ml-1">Current Password</label>
              <input 
                type="password" 
                defaultValue="password123"
                className="w-full bg-muted border-none rounded-xl py-3 px-4 text-xs font-bold text-foreground focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               <div className="space-y-3">
                <label className="text-[11px] font-bold text-muted-foreground ml-1">New Password</label>
                <input 
                  type="password" 
                  placeholder="Enter new password"
                  className="w-full bg-muted border-none rounded-xl py-3 px-4 text-xs font-bold text-foreground focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-muted-foreground ml-1">Confirm New Password</label>
                <input 
                  type="password" 
                  placeholder="Confirm new password"
                  className="w-full bg-muted border-none rounded-xl py-3 px-4 text-xs font-bold text-foreground focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div className="pt-8 border-t border-border">
               <p className="text-[11px] font-extrabold text-red-500 uppercase tracking-widest mb-4">Danger Zone</p>
               <div className="flex items-center justify-between p-4 rounded-xl bg-red-500/5 border border-red-500/10">
                  <div>
                    <p className="text-xs font-bold text-foreground mb-0.5">Deactivate Account</p>
                    <p className="text-[10px] text-red-500/70 font-medium">This will temporarily disable your account.</p>
                  </div>
                  <button className="px-4 py-2 rounded-lg border border-red-500/20 text-[10px] font-bold text-red-500 hover:bg-red-500/10 transition-colors">
                    Deactivate
                  </button>
               </div>
            </div>
          </div>
        </div>

        {/* Language & Region Section */}
        <div className="bg-card rounded-[2rem] border border-border shadow-sm overflow-hidden transition-colors">
          <div className="p-6 border-b border-border flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
               <Globe className="w-4 h-4 text-primary" />
             </div>
             <div>
               <h3 className="font-bold text-foreground text-sm">Language & Region</h3>
               <p className="text-[10px] text-muted-foreground font-medium">Customize your local experience.</p>
             </div>
          </div>
          
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-muted-foreground ml-1">Language</label>
              <div className="relative">
                <select className="w-full bg-muted border-none rounded-xl py-3 px-4 text-xs font-bold text-foreground appearance-none focus:ring-2 focus:ring-primary/20 transition-all">
                  <option>English (US)</option>
                  <option>Amharic</option>
                  <option>French</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-muted-foreground ml-1">Time Zone</label>
              <div className="relative">
                <select className="w-full bg-muted border-none rounded-xl py-3 px-4 text-xs font-bold text-foreground appearance-none focus:ring-2 focus:ring-primary/20 transition-all">
                  <option>(GMT+03:00) East Africa Time</option>
                  <option>(GMT+00:00) UTC</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="bg-card rounded-[2rem] border border-border shadow-sm overflow-hidden transition-colors">
          <div className="p-6 border-b border-border flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
               <Bell className="w-4 h-4 text-primary" />
             </div>
             <div>
               <h3 className="font-bold text-foreground text-sm">Notification Preferences</h3>
               <p className="text-[10px] text-muted-foreground font-medium">Manage how you receive updates and alerts.</p>
             </div>
          </div>
          
          <div className="p-8 divide-y divide-border">
             <ToggleRow 
               title="Email Notifications" 
               description="Receive booking confirmations and receipts via email." 
               enabled 
             />
             <ToggleRow 
               title="Push Notifications" 
               description="Get instant alerts about your reservation status." 
               enabled 
             />
             <ToggleRow 
               title="Marketing Updates" 
               description="Receive news about promotions and new features." 
             />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-6">
           <button className="px-8 py-3 rounded-2xl border border-border text-sm font-bold text-muted-foreground hover:bg-muted transition-colors">
             Cancel
           </button>
           <button className="px-8 py-3 rounded-2xl bg-primary text-white text-sm font-bold hover:opacity-90 transition-colors shadow-lg shadow-primary/20">
             Save Changes
           </button>
        </div>
      </div>
    </DashboardLayout>
  );
}

function ToggleRow({ title, description, enabled }: { title: string; description: string; enabled?: boolean }) {
  return (
    <div className="py-6 flex items-center justify-between group">
      <div className="max-w-md">
        <p className="text-xs font-bold text-foreground mb-0.5">{title}</p>
        <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">{description}</p>
      </div>
      <button className={`w-11 h-6 rounded-full relative transition-colors duration-300 ${enabled ? 'bg-primary' : 'bg-muted border border-border'}`}>
         <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${enabled ? 'left-6 shadow-sm' : 'left-1'}`} />
         {enabled && (
           <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
              <div className="w-1 h-1 bg-white rounded-full opacity-40 shrink-0" />
           </div>
         )}
      </button>
    </div>
  );
}
