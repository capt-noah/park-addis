"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import Loader from "@/components/Loader";
import { useUI } from "@/components/ui/UIProvider";

export default function ForgotPasswordPage() {
  const { showNotification } = useUI();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate/request password reset
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSubmitted(true);
      showNotification("Password reset link sent to your email!", "success");
    } catch {
      showNotification("Failed to send reset email. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center pt-16 px-6 pb-12 transition-colors duration-300">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-primary/20 shadow-sm">
            <span className="text-primary font-bold text-2xl">P</span>
          </div>
          <h1 className="text-3xl font-extrabold text-foreground mb-2">Reset Password</h1>
          <p className="text-muted-foreground font-medium text-sm">
            Enter your email to receive password reset instructions
          </p>
        </div>

        <div className="bg-card rounded-[2.5rem] border border-border shadow-sm p-8 mb-8 transition-colors">
          {submitted ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                <CheckCircle2 size={36} />
              </div>
              <h2 className="text-xl font-bold text-foreground">Check Your Email</h2>
              <p className="text-sm text-muted-foreground">
                We've sent password reset instructions to <span className="font-bold text-foreground">{email}</span>.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs font-bold text-primary hover:underline pt-2"
              >
                Didn't receive the email? Try again
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
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

              <button
                disabled={loading}
                type="submit"
                className={`w-full h-14 bg-primary text-white rounded-2xl font-bold text-base transition-all shadow-lg shadow-primary/20 ${
                  loading ? "cursor-not-allowed opacity-50" : "active:scale-[0.98] hover:opacity-95 cursor-pointer"
                }`}
              >
                {loading ? <Loader /> : "Send Reset Link"}
              </button>
            </form>
          )}
        </div>

        <div className="text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} />
            Back to login
          </Link>
        </div>
      </div>
    </main>
  );
}
