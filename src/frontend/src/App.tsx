import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import { toast } from "sonner";
import { BookingModal } from "./components/BookingModal";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { SignUpModal } from "./components/SignUpModal";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { UserRole, useCallerRole } from "./hooks/useQueries";
import { useCallerMembership, useCallerProfile } from "./hooks/useQueries";
import { AdminPage } from "./pages/AdminPage";
import { DashboardPage } from "./pages/DashboardPage";
import { LandingPage } from "./pages/LandingPage";
import { MembershipPage } from "./pages/MembershipPage";

type Page = "home" | "services" | "membership" | "dashboard" | "admin";

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [bookingOpen, setBookingOpen] = useState(false);
  const { data: role } = useCallerRole();
  const { identity, login } = useInternetIdentity();
  const { data: membership } = useCallerMembership();
  const { data: profile, isLoading: profileLoading } = useCallerProfile();

  // Show sign-up modal if logged in but no profile yet
  const showSignUp = !!identity && !profileLoading && profile === null;

  const navigate = (p: string) => {
    if (p === "services") {
      setPage("home");
      setTimeout(() => {
        document
          .getElementById("services")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
      return;
    }
    if (p === "dashboard" && !identity) {
      setPage("home");
      return;
    }
    if (p === "admin" && role !== UserRole.admin) {
      setPage("home");
      return;
    }
    setPage(p as Page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBookService = () => {
    if (!identity) {
      toast.info("Please sign in to book a service.");
      login();
      return;
    }
    setBookingOpen(true);
  };

  const handleSignUpComplete = () => {
    navigate("dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar activePage={page} onNavigate={navigate} />
      <main className="flex-1">
        {page === "home" && (
          <LandingPage
            onBookService={handleBookService}
            onNavigate={navigate}
          />
        )}
        {page === "membership" && <MembershipPage />}
        {page === "dashboard" && identity && <DashboardPage />}
        {page === "admin" && role === UserRole.admin && <AdminPage />}
      </main>
      <Footer />
      <BookingModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        membership={membership}
      />
      <SignUpModal open={showSignUp} onComplete={handleSignUpComplete} />
      <Toaster richColors position="top-right" />
    </div>
  );
}
