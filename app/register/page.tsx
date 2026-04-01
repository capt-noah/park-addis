"use client";

import { useRouter } from "next/navigation"
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, Chrome, Apple, User, Car, Building2, Phone, Hash, Palette } from "lucide-react";
import { useState } from "react";
import Loader from "@/components/Loader";

export default function RegisterPage() {
  const [step, setStep] = useState(1);

  const [role, setRole] = useState<"driver" | "owner">("driver");
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [password, setPassword] = useState("")
  const [carModel, setCarModel] = useState("")
  const [licensePlate, setLicensePlate] = useState("")
  const [carColor, setCarColor] = useState("")

  // Format phone: strip non-digits, keep max 9 digits after country code
  const handlePhoneChange = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 9)
    setPhoneNumber(digits)
  }
  const displayPhone = phoneNumber
    ? phoneNumber.replace(/(\d{3})(\d{0,3})(\d{0,3})/, (_, a, b, c) =>
        [a, b, c].filter(Boolean).join(" ")
      )
    : ""

  // Format Ethiopian plate: e.g. AA 2 A12345
  const handlePlateChange = (val: string) => {
    // Strip spaces/dashes, uppercase
    const clean = val.replace(/[\s-]/g, "").toUpperCase().slice(0, 9)
    setLicensePlate(clean)
  }
  const displayPlate = (() => {
    const p = licensePlate
    if (p.length <= 2) return p
    if (p.length <= 3) return `${p.slice(0,2)} - ${p.slice(2)}`
    return `${p.slice(0,2)} - ${p.slice(2,3)} - ${p.slice(3)}`
  })()

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName,
        email,
        password,
        phoneNumber,
        role,
        car: {
          plateNumber: licensePlate,
          carModel,
          color: carColor,
        },
      }),
    });

    const data = await res.json();

    if (res.ok && data.ok) {
      router.replace("/dashboard");
      router.refresh();
    } else {
      setError(data.error || "Registration failed")
      setLoading(false)
    }
  }

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault()
    if (role === 'owner') {
      handleSignup(e);
    } else {
      setStep(2);
    }
  }

  return (
    <main className="min-h-screen bg-background flex flex-col items-center pt-6 px-6 pb-6 transition-colors duration-300">
      <div className="w-full max-w-md">
        {/* Branding */}
        <div className="text-center mb-4">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-2 border border-primary/20 shadow-sm">
            <span className="text-primary font-bold text-2xl">P</span>
          </div>
          <h1 className="text-2xl font-extrabold text-foreground mb-1">Join ParkAddis</h1>
          <p className="text-muted-foreground font-medium text-xs">Find or list parking spaces in Addis Ababa</p>
        </div>

        {/* Step Progress Indicator - only show for drivers */}
        {role === 'driver' && (
          <div className="flex gap-2 mb-4">
            <div className="flex-1 h-1.5 rounded-full bg-primary transition-colors" />
            <div className={`flex-1 h-1.5 rounded-full transition-colors duration-300 ${step === 2 ? 'bg-primary' : 'bg-muted'}`} />
          </div>
        )}

        {/* Form Card */}
        <div className="bg-card rounded-[2.5rem] border border-border shadow-sm p-6 mb-6 transition-colors">
          <form onSubmit={step === 1 ? handleNextStep : handleSignup} className="space-y-4">
            {step === 1 && (
              <>
                {/* Role Selector */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-foreground/70 uppercase tracking-widest ml-1">I am a...</label>
                  <div className="flex p-1 bg-muted rounded-2xl border border-border">
                    <button 
                      type="button"
                      onClick={() => setRole("driver")}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                        role === "driver" 
                        ? "bg-card text-primary shadow-sm" 
                        : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Car className={`w-4 h-4 ${role === "driver" ? "text-primary" : "text-muted-foreground"}`} />
                      Driver
                    </button>
                    <button 
                      type="button"
                      onClick={() => setRole("owner")}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                        role === "owner" 
                        ? "bg-card text-primary shadow-sm" 
                        : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Building2 className={`w-4 h-4 ${role === "owner" ? "text-primary" : "text-muted-foreground"}`} />
                      Parking Owner
                    </button>
                  </div>
                </div>

                {/* Name Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground/80 ml-1">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input 
                      value={fullName}
                      onChange={(e) => {setFullName(e.target.value)}}
                      required
                      type="text" 
                      placeholder="Abebe Bikila"
                      className="w-full bg-muted/30 border border-border rounded-2xl py-3 pl-11 pr-4 text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium text-foreground placeholder:text-muted-foreground/50"
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground/80 ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input 
                      value={email}
                      onChange={(e) => {setEmail(e.target.value)}}
                      required
                      type="email" 
                      placeholder="abebe@example.com"
                      className="w-full bg-muted/30 border border-border rounded-2xl py-3 pl-11 pr-4 text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium text-foreground placeholder:text-muted-foreground/50"
                    />
                  </div>
                </div>

                {/* Phone Number Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground/80 ml-1">Phone Number</label>
                  <div className="relative group flex">
                    <span className="flex items-center gap-1.5 bg-muted/50 border border-border border-r-0 rounded-l-2xl px-3 text-sm font-bold text-muted-foreground select-none whitespace-nowrap">
                      🇪🇹 +251
                    </span>
                    <input 
                      value={displayPhone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      required
                      type="tel"
                      inputMode="numeric"
                      placeholder="9XX XXX XXX"
                      className="flex-1 bg-muted/30 border border-border rounded-r-2xl py-3 px-4 text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium text-foreground placeholder:text-muted-foreground/50"
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground/60 ml-1">Enter your 9-digit local number</p>
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground/80 ml-1">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input 
                      value={password}
                      onChange={(e) => {setPassword(e.target.value)}}
                      required
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full bg-muted/30 border border-border rounded-2xl py-3 pl-11 pr-11 text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium text-foreground placeholder:text-muted-foreground/50"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </>
            )}

            {step === 2 && role === 'driver' && (
              <>
                <div className="mb-2">
                  <h3 className="text-lg font-bold text-foreground">Vehicle Information</h3>
                  <p className="text-xs text-muted-foreground">Please provide your car details for identification.</p>
                </div>

                {/* Ethiopian Plate Number */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground/80 ml-1">Ethiopian Plate Number</label>
                  <div className="relative group">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input 
                      required
                      value={displayPlate}
                      onChange={(e) => handlePlateChange(e.target.value)}
                      type="text"
                      placeholder="AA - 2 - A12345"
                      className="w-full bg-muted/30 border border-border rounded-2xl py-3 pl-11 pr-4 text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium text-foreground placeholder:text-muted-foreground/50 tracking-widest"
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground/60 ml-1">Format: AA - 2 - A12345</p>
                </div>

                {/* Car Model Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground/80 ml-1">Car Model</label>
                  <div className="relative group">
                    <Car className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input 
                      required
                      value={carModel}
                      onChange={(e) => {setCarModel(e.target.value)}}
                      type="text" 
                      placeholder="e.g. Toyota Corolla"
                      className="w-full bg-muted/30 border border-border rounded-2xl py-3 pl-11 pr-4 text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium text-foreground placeholder:text-muted-foreground/50"
                    />
                  </div>
                </div>

                {/* Car Color Dropdown */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground/80 ml-1">Car Color</label>
                  <div className="relative group">
                    <Palette className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none" />
                    <select
                      value={carColor}
                      onChange={(e) => setCarColor(e.target.value)}
                      className="w-full bg-muted/30 border border-border rounded-2xl py-3 pl-11 pr-10 text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium text-foreground appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Select car color</option>
                      <option value="black">Black</option>
                      <option value="white">White</option>
                      <option value="silver">Silver</option>
                      <option value="gray">Gray</option>
                      <option value="red">Red</option>
                      <option value="blue">Blue</option>
                      <option value="green">Green</option>
                      <option value="yellow">Yellow</option>
                      <option value="orange">Orange</option>
                      <option value="brown">Brown</option>
                      <option value="other">Other</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Terms Checkbox */}
            {(step === 1 || step === 2) && (
              <div className="flex items-start gap-2 ml-1">
                <input 
                  required
                  type="checkbox" 
                  id="terms"
                  className="mt-0.5 w-3.5 h-3.5 rounded border-border text-primary focus:ring-primary/20 cursor-pointer"
                />
                <label htmlFor="terms" className="text-[10px] text-muted-foreground font-medium leading-relaxed">
                  By creating an account, you agree to our <Link href="/terms" className="text-primary font-bold hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-primary font-bold hover:underline">Privacy Policy</Link>.
                </label>
              </div>
            )}

            {
              error && <p className="w-full flex justify-center text-red-400 text-sm" >{ error }</p>
            }

            {/* Navigation / Submit Buttons */}
            <div className="flex gap-3 pt-2">
              {step === 2 && (
                <button 
                  type="button" 
                  onClick={() => setStep(1)} 
                  className="w-1/3 bg-muted text-foreground py-3 rounded-2xl font-bold text-sm transition-all hover:bg-muted/80"
                >
                  Back
                </button>
              )}
              <button 
                disabled={loading} 
                type="submit" 
                className={`flex-1 bg-primary text-white py-3 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-primary/20 ${loading? "cursor-not-allowed opacity-50" : "active:scale-[0.98] hover:opacity-95 cursor-pointer"} `}
              >
                {
                  loading ?
                    <Loader /> : (step === 1 && role === 'driver' ? "Next Step" : "Complete Registration")
                }
              </button>
            </div>

            {/* Login Link */}
            {step === 1 && (
              <p className="text-center text-xs font-medium text-muted-foreground mt-2">
                Already have an account? <Link href="/login" className="text-primary font-bold hover:underline">Log In</Link>
              </p>
            )}
          </form>
        </div>

        {/* Divider */}
        {step === 1 && (
          <>
            <div className="relative flex items-center justify-center py-2 mb-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/50"></div>
              </div>
              <span className="relative bg-background px-4 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Or register with</span>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 bg-card border border-border py-2.5 rounded-2xl hover:bg-muted transition-colors font-bold text-xs text-foreground shadow-sm">
                <Chrome className="w-4 h-4" />
                Google
              </button>
              <button className="flex items-center justify-center gap-2 bg-card border border-border py-2.5 rounded-2xl hover:bg-muted transition-colors font-bold text-xs text-foreground shadow-sm">
                <Apple className="w-4 h-4" />
                Apple
              </button>
            </div>
          </>
        )}

      </div>
    </main>
  );
}
