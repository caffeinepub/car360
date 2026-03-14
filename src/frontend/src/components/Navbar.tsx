import { Button } from "@/components/ui/button";
import { Car, Menu, X } from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { UserRole, useCallerRole } from "../hooks/useQueries";

interface NavbarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

export function Navbar({ activePage, onNavigate }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const { data: role } = useCallerRole();

  const isLoggedIn = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const navLinks = [
    { id: "home", label: "Home" },
    { id: "services", label: "Services" },
    { id: "membership", label: "Membership" },
    ...(isLoggedIn ? [{ id: "dashboard", label: "Dashboard" }] : []),
    ...(role === UserRole.admin ? [{ id: "admin", label: "Admin" }] : []),
  ];

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-dark-300/90 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2 group"
          data-ocid="nav.link"
        >
          <div className="w-8 h-8 rounded bg-crimson-600 flex items-center justify-center">
            <Car className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-xl text-white tracking-tight">
            car<span className="text-crimson-400">360</span>
          </span>
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              type="button"
              key={link.id}
              onClick={() => onNavigate(link.id)}
              data-ocid={`nav.${link.id}.link`}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activePage === link.id
                  ? "bg-crimson-600/20 text-crimson-400"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <span className="text-white/50 text-xs">
                {identity.getPrincipal().toString().slice(0, 8)}...
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={clear}
                className="border-white/20 text-white hover:bg-white/10"
                data-ocid="nav.logout.button"
              >
                Logout
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              onClick={login}
              disabled={isLoggingIn}
              className="bg-crimson-600 hover:bg-crimson-700 text-white border-0"
              data-ocid="nav.login.button"
            >
              {isLoggingIn ? "Connecting..." : "Login"}
            </Button>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="md:hidden text-white p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          data-ocid="nav.toggle"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-dark-300 border-t border-white/10 px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <button
              type="button"
              key={link.id}
              onClick={() => {
                onNavigate(link.id);
                setMenuOpen(false);
              }}
              data-ocid={`nav.mobile.${link.id}.link`}
              className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activePage === link.id
                  ? "bg-crimson-600/20 text-crimson-400"
                  : "text-white/70 hover:text-white"
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2">
            {isLoggedIn ? (
              <Button
                size="sm"
                variant="outline"
                onClick={clear}
                className="w-full border-white/20 text-white"
                data-ocid="nav.mobile.logout.button"
              >
                Logout
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={login}
                className="w-full bg-crimson-600 text-white"
                data-ocid="nav.mobile.login.button"
              >
                Login
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
