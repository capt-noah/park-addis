import { DashboardLayout } from "@/components/DashboardLayout";
import { User, Mail, Phone, Calendar, MapPin, Car, Plus, ShieldUser,ExternalLink} from "lucide-react";
import Image from "next/image";
import { findUserBySession } from "@/src/services/auth.service";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function ProfilePage() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get("sessionId")?.value
  if (!sessionId) redirect("/login")
  const dbUser = await findUserBySession(sessionId)
  if (!dbUser) redirect("/login")
  const user = { userId: dbUser.id, fullName: dbUser.fullName, email: dbUser.email, role: dbUser.role ?? "user" }

  return (
    <DashboardLayout user={user}>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-primary mb-1">Profile Settings</h1>
      </div>

      <div className="space-y-6 max-w-5xl">
        {/* Header Card */}
        <div className="bg-card rounded-[2rem] p-8 border border-border shadow-sm flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group transition-colors">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/10 relative flex-shrink-0">
            <Image 
              src="/avatar.png"
              alt="Profile" 
              fill 
              className="object-cover"
            />
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-extrabold text-foreground mb-1">{user.fullName}</h2>
            <p className="text-muted-foreground text-sm font-medium mb-4">{user.role}</p>
            
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
               <div className="flex items-center gap-2 text-[11px] font-bold">
                 <Calendar className="w-4 h-4 text-muted-foreground/60" />
                 Member since Oct 2021
               </div>
               <div className="flex items-center gap-2 text-[11px] font-bold">
                 <MapPin className="w-4 h-4 text-muted-foreground/60" />
                 Addis Ababa, Ethiopia
               </div>
            </div>
          </div>

          <button className="px-5 py-2.5 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:bg-muted transition-colors flex items-center gap-2">
            View Public Profile <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Personal Information */}
        <div className="bg-card rounded-[2rem] border border-border shadow-sm overflow-hidden transition-colors">
          <div className="p-6 border-b border-border flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
               <User className="w-4 h-4 text-primary" />
             </div>
             <h3 className="font-bold text-foreground">Personal Information</h3>
          </div>
          
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-muted-foreground ml-1">First Name</label>
              <input 
                type="text" 
                defaultValue={user.fullName.split(' ')[0]}
                className="w-full bg-muted border-none rounded-xl py-3 px-4 text-xs font-bold text-foreground focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-muted-foreground ml-1">Last Name</label>
              <input 
                type="text" 
                defaultValue={user.fullName.split(' ').slice(1).join(' ')}
                className="w-full bg-muted border-none rounded-xl py-3 px-4 text-xs font-bold text-foreground focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-muted-foreground ml-1">Email Address</label>
              <input 
                type="email" 
                defaultValue={user.email}
                className="w-full bg-muted border-none rounded-xl py-3 px-4 text-xs font-bold text-foreground focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-muted-foreground ml-1">Phone Number</label>
              <input 
                type="text" 
                defaultValue="+251 91 123 4567"
                className="w-full bg-muted border-none rounded-xl py-3 px-4 text-xs font-bold text-foreground focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
              />
            </div>
          </div>
        </div>

        {/* Vehicle Information */}
        <div className="bg-card rounded-[2rem] border border-border shadow-sm overflow-hidden transition-colors">
          <div className="p-6 border-b border-border flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
               <Car className="w-4 h-4 text-primary" />
             </div>
             <h3 className="font-bold text-foreground">Vehicle Information</h3>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 mb-8">
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-muted-foreground ml-1">License Plate</label>
                <div className="flex items-center gap-3 bg-muted rounded-xl px-4 py-3 border border-border/50">
                   <div className="px-2 py-0.5 bg-card border border-border rounded text-[10px] font-bold text-muted-foreground">ET</div>
                   <input 
                    type="text" 
                    defaultValue="A 24589"
                    className="flex-1 bg-transparent border-none p-0 text-xs font-bold text-foreground focus:ring-0"
                   />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-muted-foreground ml-1">Car Model</label>
                <input 
                  type="text" 
                  defaultValue="Toyota Corolla 2018"
                  className="w-full bg-muted border-none rounded-xl py-3 px-4 text-xs font-bold text-foreground focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-3 mb-10">
              <label className="text-[11px] font-bold text-muted-foreground ml-1">Color</label>
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-[#bdcad9] border-4 border-primary shadow-sm cursor-pointer" />
                 <span className="text-xs font-bold text-muted-foreground">Silver Metallic</span>
              </div>
            </div>

            <button className="flex items-center gap-2 text-xs font-bold text-primary hover:underline">
               <Plus className="w-4 h-4" /> Add another vehicle
            </button>
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
