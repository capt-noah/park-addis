import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground py-16 px-6 max-w-4xl mx-auto">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground mb-8"
      >
        <ArrowLeft size={16} /> Back to Home
      </Link>
      <h1 className="text-3xl font-extrabold text-primary mb-6">Privacy Policy</h1>
      <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
        <p>ParkAddis is dedicated to protecting your privacy. This policy explains what information we collect and how we use it.</p>
        <h2 className="text-lg font-bold text-foreground">1. Information We Collect</h2>
        <p>We collect account details (name, email, phone number) and vehicle details (plate number, car model) necessary to manage your parking sessions.</p>
        <h2 className="text-lg font-bold text-foreground">2. Data Security</h2>
        <p>Your passwords and payment details are encrypted using industry-standard security protocols and are never stored in plaintext.</p>
      </div>
    </main>
  );
}
