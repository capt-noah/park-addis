"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import Loader from "@/components/Loader";
import { useUI } from "@/components/ui/UIProvider";

export default function LoginPage() {
  const { showNotification } = useUI();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      
      if (res.ok) {
        showNotification("Login successful", "success");
        window.location.href = "/dashboard";
      } else {
        const data = await res.json();
        const errorMsg = data.error || "Invalid email or password.";
        setError(errorMsg);
        showNotification(errorMsg, "error");
        setLoading(false);
      }
    } catch {
      const errorMsg = "Unable to connect. Please check your network.";
      setError(errorMsg);
      showNotification(errorMsg, "error");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center py-12 px-6 transition-colors duration-300">
      <div className="w-full max-w-md">
        
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white font-extrabold text-xl">P</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-primary">ParkAddis</span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Log in to your account</h1>
        </div>

        {/* Form Card */}
        <div className="bg-card rounded-2xl border border-border shadow-xs p-8 transition-colors">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80">Email address or phone</label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="text" 
                  placeholder="name@example.com or 09XXXXXXXX"
                  className="w-full bg-muted/30 border border-border rounded-xl py-3 pl-10 pr-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all outline-none text-foreground placeholder:text-muted-foreground/50"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-foreground/80">Password</label>
                <Link href="/forgot-password" className="text-xs font-medium text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••"
                  className="w-full bg-muted/30 border border-border rounded-xl py-3 pl-10 pr-10 text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all outline-none text-foreground placeholder:text-muted-foreground/50"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-xs text-rose-500 font-medium text-center bg-rose-500/10 py-2 px-3 rounded-lg border border-rose-500/20">
                {error}
              </p>
            )}

            <button 
              disabled={loading} 
              type="submit" 
              className={`w-full py-3 bg-primary text-white rounded-xl font-bold text-sm transition-all shadow-sm ${
                loading ? "cursor-not-allowed opacity-60" : "hover:opacity-95 active:scale-[0.99] cursor-pointer"
              }`}
            >
              {loading ? <Loader /> : "Log In"}
            </button>

            <p className="text-center text-xs font-medium text-muted-foreground pt-2">
              Don't have an account?{" "}
              <Link href="/register" className="text-primary font-bold hover:underline">
                Sign up
              </Link>
            </p>
          </form>
        </div>

      </div>
    </main>
  );
}
