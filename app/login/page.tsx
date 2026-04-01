"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, Chrome, Apple } from "lucide-react";
import Loader from "@/components/Loader";
import { useUI } from "@/components/ui/UIProvider";

export default function LoginPage() {
  const { showNotification } = useUI();
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({email, password})
    })

    if (res.ok) {
      showNotification("Login successful!", "success");
      router.replace("/dashboard")
      router.refresh()
    } else {
      const data = await res.json()
      const errorMsg = data.error || "Login failed";
      setError(errorMsg)
      showNotification(errorMsg, "error");
      setLoading(false)
    }

  }



  return (
    <main className="min-h-screen bg-background flex flex-col items-center pt-16 px-6 transition-colors duration-300">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-primary/20 shadow-sm">
            <span className="text-primary font-bold text-2xl">P</span>
          </div>
          <h1 className="text-3xl font-extrabold text-foreground mb-2">Welcome back</h1>
          <p className="text-muted-foreground font-medium text-sm">Enter your details to manage your parking</p>
        </div>

        <div className="bg-card rounded-[2.5rem] border border-border shadow-sm p-8 mb-8 transition-colors">

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground/80 ml-1">Email address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email" 
                  placeholder="name@example.com"
                  className="w-full bg-muted/30 border border-border rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium text-foreground placeholder:text-muted-foreground/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-bold text-foreground/80">Password</label>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password" 
                  placeholder="••••••••"
                  className="w-full bg-muted/30 border border-border rounded-2xl py-4 pl-12 pr-12 text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium text-foreground placeholder:text-muted-foreground/50"
                />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  <Eye className="w-5 h-5" />
                </button>
              </div>
            </div>

            {error && <p className="w-full flex justify-center text-red-400" >{ error }</p>}

            <div className="text-right">
               <Link href="/forgot-password" title="Forgot password?" className="text-sm font-bold text-primary hover:underline transition-all">
                  Forgot password?
                </Link>
            </div>

            <button disabled={loading} type="submit" className={`w-full h-15 bg-primary text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-primary/20 ${loading? "cursor-not-allowed opacity-50" : "active:scale-[0.98] hover:opacity-95 cursor-pointer "} `}>
              {
                loading ?
                  <Loader /> : <p>Login</p>
              }
            </button>

            <p className="text-center text-sm font-medium text-muted-foreground">
              Don't have an account? <Link href="/register" className="text-primary font-bold hover:underline">Create account</Link>
            </p>
          </form>

        </div>

        <div className="relative flex items-center justify-center py-4 mb-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/50"></div>
          </div>
          <span className="relative bg-background px-4 text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">Or continue with</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-3 bg-card border border-border py-3.5 rounded-2xl hover:bg-muted transition-colors font-bold text-sm text-foreground shadow-sm">
            <Chrome className="w-5 h-5" />
            Google
          </button>
          <button className="flex items-center justify-center gap-3 bg-card border border-border py-3.5 rounded-2xl hover:bg-muted transition-colors font-bold text-sm text-foreground shadow-sm">
            <Apple className="w-5 h-5" />
            Apple
          </button>
        </div>
      </div>
    </main>
  );
}
