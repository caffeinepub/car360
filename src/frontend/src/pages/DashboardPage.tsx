import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  CalendarDays,
  Car,
  CheckCircle,
  Clock,
  CreditCard,
  Droplets,
  Plus,
  XCircle,
} from "lucide-react";
import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { BookingModal } from "../components/BookingModal";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  type Booking,
  BookingStatus,
  useCallerBookings,
  useCallerMembership,
  usePurchaseMembership,
} from "../hooks/useQueries";

const STATUS_CONFIG: Record<
  BookingStatus,
  { label: string; color: string; icon: React.ElementType }
> = {
  [BookingStatus.pending]: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    icon: Clock,
  },
  [BookingStatus.confirmed]: {
    label: "Confirmed",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    icon: AlertCircle,
  },
  [BookingStatus.completed]: {
    label: "Completed",
    color: "bg-green-100 text-green-700 border-green-200",
    icon: CheckCircle,
  },
  [BookingStatus.cancelled]: {
    label: "Cancelled",
    color: "bg-red-100 text-red-600 border-red-200",
    icon: XCircle,
  },
};

function BookingCard({ booking, index }: { booking: Booking; index: number }) {
  const cfg = STATUS_CONFIG[booking.status];
  const date = new Date(Number(booking.date) / 1_000_000);
  return (
    <Card data-ocid={`bookings.item.${index}`} className="border-border">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-crimson-50 flex items-center justify-center flex-shrink-0">
              <Car className="w-5 h-5 text-crimson-600" />
            </div>
            <div>
              <div className="font-semibold text-foreground text-sm">
                {booking.carModel}
              </div>
              <div className="text-muted-foreground text-xs mt-0.5 flex items-center gap-1">
                <CalendarDays className="w-3 h-3" />
                {date.toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.color}`}
          >
            <cfg.icon className="w-3 h-3" />
            {cfg.label}
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-border flex items-center gap-3 text-xs text-muted-foreground">
          <span>{booking.name}</span>
          <span>·</span>
          <span>{booking.phone}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardPage() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const { data: bookings = [], isLoading: bookingsLoading } =
    useCallerBookings();
  const { data: membership, isLoading: membershipLoading } =
    useCallerMembership();
  const purchaseMembership = usePurchaseMembership();
  const { identity } = useInternetIdentity();

  const hasMembership = membership?.activated;
  const remainingWashes = hasMembership
    ? Number(membership?.remainingCarWashes)
    : 0;

  const handlePurchase = async () => {
    try {
      await purchaseMembership.mutateAsync();
      toast.success("Membership activated! Enjoy your 10 free car washes.");
    } catch {
      toast.error("Purchase failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display font-bold text-3xl text-foreground">
                My Dashboard
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                {identity?.getPrincipal().toString().slice(0, 16)}...
              </p>
            </div>
            <Button
              onClick={() => setBookingOpen(true)}
              className="bg-crimson-600 hover:bg-crimson-700 text-white"
              data-ocid="dashboard.primary_button"
            >
              <Plus className="w-4 h-4 mr-2" /> Book Service
            </Button>
          </div>

          {/* Membership Card */}
          <div className="mb-8">
            {membershipLoading ? (
              <Skeleton
                className="h-36 rounded-xl"
                data-ocid="dashboard.loading_state"
              />
            ) : hasMembership ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative overflow-hidden rounded-xl bg-dark-300 p-6 text-white"
                data-ocid="membership.card"
              >
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(45deg, oklch(0.44 0.18 22), oklch(0.44 0.18 22) 1px, transparent 1px, transparent 30px)",
                  }}
                />
                <div className="relative flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="w-4 h-4 text-crimson-400" />
                      <span className="text-crimson-400 text-xs font-semibold uppercase tracking-wider">
                        Premium Member
                      </span>
                    </div>
                    <div className="font-display font-bold text-2xl">
                      car360 Premium
                    </div>
                    <div className="text-white/60 text-sm mt-1">
                      Valid till{" "}
                      {new Date(
                        Number(membership?.endDate) / 1_000_000,
                      ).toLocaleDateString("en-IN", {
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-5xl font-display font-bold text-crimson-400">
                      {remainingWashes}
                    </div>
                    <div className="flex items-center gap-1 text-white/60 text-xs mt-1">
                      <Droplets className="w-3 h-3" /> Free washes left
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <Card className="border-dashed border-crimson-200 bg-crimson-50/50">
                <CardContent
                  className="p-6 text-center"
                  data-ocid="membership.empty_state"
                >
                  <div className="w-12 h-12 rounded-full bg-crimson-100 flex items-center justify-center mx-auto mb-3">
                    <CreditCard className="w-6 h-6 text-crimson-600" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-1">
                    No Active Membership
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Get 10 free car washes + priority booking for just
                    ₹1,100/year
                  </p>
                  <Button
                    onClick={handlePurchase}
                    disabled={purchaseMembership.isPending}
                    className="bg-crimson-600 hover:bg-crimson-700 text-white"
                    data-ocid="membership.primary_button"
                  >
                    {purchaseMembership.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    {purchaseMembership.isPending
                      ? "Processing..."
                      : "Activate — ₹1,100/yr"}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Bookings */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="font-display text-xl">
                My Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              {bookingsLoading ? (
                <div className="space-y-3" data-ocid="bookings.loading_state">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20 rounded-lg" />
                  ))}
                </div>
              ) : bookings.length === 0 ? (
                <div
                  className="text-center py-10"
                  data-ocid="bookings.empty_state"
                >
                  <Car className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No bookings yet</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => setBookingOpen(true)}
                    data-ocid="bookings.secondary_button"
                  >
                    Book your first service
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {bookings.map((booking, i) => (
                    <BookingCard
                      key={String(booking.id)}
                      booking={booking}
                      index={i + 1}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <BookingModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        membership={membership}
      />
    </div>
  );
}
