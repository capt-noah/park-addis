import { Facebook, Twitter, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-background pt-16 pb-8 px-6 border-t border-border transition-colors duration-300">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-primary">ParkAddis</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-xs transition-colors">
            Making parking effortless in Addis Ababa. Smart solutions for modern drivers.
          </p>
          <div className="flex gap-4">
            <Facebook className="w-5 h-5 text-muted-foreground/60 hover:text-primary cursor-pointer transition-colors" />
            <Twitter className="w-5 h-5 text-muted-foreground/60 hover:text-primary cursor-pointer transition-colors" />
          </div>
        </div>
        
        <div>
          <h4 className="font-bold text-foreground mb-4">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="hover:text-primary cursor-pointer transition-colors">About Us</li>
            <li className="hover:text-primary cursor-pointer transition-colors">Careers</li>
            <li className="hover:text-primary cursor-pointer transition-colors">Press</li>
            <li className="hover:text-primary cursor-pointer transition-colors">Contact</li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold text-foreground mb-4">Resources</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="hover:text-primary cursor-pointer transition-colors">Blog</li>
            <li className="hover:text-primary cursor-pointer transition-colors">Help Center</li>
            <li className="hover:text-primary cursor-pointer transition-colors">Terms of Service</li>
            <li className="hover:text-primary cursor-pointer transition-colors">Privacy Policy</li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold text-foreground mb-4">Partners</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="hover:text-primary cursor-pointer transition-colors">For Parking Owners</li>
            <li className="hover:text-primary cursor-pointer transition-colors">For Businesses</li>
            <li className="hover:text-primary cursor-pointer transition-colors">Developer API</li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground/60 font-medium transition-colors">
        <p>© 2023 ParkAddis. All rights reserved.</p>
        <div className="flex gap-6">
          <span className="hover:text-primary cursor-pointer">Privacy</span>
          <span className="hover:text-primary cursor-pointer">Terms</span>
          <span className="hover:text-primary cursor-pointer">Sitemap</span>
        </div>
      </div>
    </footer>
  );
}
