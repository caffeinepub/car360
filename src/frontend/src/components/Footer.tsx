import { Car, Mail, MapPin, Phone } from "lucide-react";

const SERVICES_LINKS = [
  "Car Wash & Detailing",
  "Tire Services",
  "Engine Diagnostics",
  "AC & Electrical",
  "Body & Paint",
];

export function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";

  return (
    <footer className="bg-dark-300 text-white/70 border-t border-white/10">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded bg-crimson-600 flex items-center justify-center">
                <Car className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-white">
                car<span className="text-crimson-400">360</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              India's most trusted car service platform. Professional care for
              every vehicle.
            </p>
            <div className="text-xs text-white/40">
              © {year}. Built with ❤️ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-crimson-400 hover:text-crimson-300 transition-colors"
              >
                caffeine.ai
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-white text-sm mb-4 uppercase tracking-wider">
              Services
            </h3>
            <ul className="space-y-2">
              {SERVICES_LINKS.map((s) => (
                <li key={s}>
                  <span className="text-sm hover:text-white transition-colors cursor-pointer">
                    {s}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-white text-sm mb-4 uppercase tracking-wider">
              Company
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  About Us
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Careers
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Partner With Us
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Privacy Policy
                </span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white text-sm mb-4 uppercase tracking-wider">
              Contact
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-crimson-400" />
                +91 98765 43210
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-crimson-400" />
                hello@car360.in
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-crimson-400" />
                Bengaluru, Karnataka
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
