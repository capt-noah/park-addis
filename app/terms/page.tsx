import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground py-16 px-6 max-w-4xl mx-auto">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground mb-8"
      >
        <ArrowLeft size={16} /> Back to Home
      </Link>
      <h1 className="text-3xl font-extrabold text-primary mb-6">Terms of Service</h1>
      <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
        <p>Welcome to ParkAddis. By accessing or using our platform, you agree to comply with and be bound by these Terms of Service.</p>
        <h2 className="text-lg font-bold text-foreground">1. Parking Reservations</h2>
        <p>All reservations made through ParkAddis are subject to space availability and confirmation. Users must abide by local traffic laws and parking location regulations.</p>
        <h2 className="text-lg font-bold text-foreground">2. Payments & Fees</h2>
        <p>Fees are calculated based on duration and hourly rates displayed at booking. Payment can be settled via digital wallet or approved payment gateways.</p>
        <h2 className="text-lg font-bold text-foreground">3. Cancellations</h2>
        <p>Cancellations within the eligible grace period qualify for automatic wallet refunds.</p>
      </div>
    </main>
  );
}
