import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Award,
  CheckCircle2,
  Droplets,
  Loader2,
  Phone,
  Shield,
  Star,
  Truck,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useCallerMembership,
  usePurchaseMembership,
} from "../hooks/useQueries";

const BENEFITS = [
  {
    icon: Droplets,
    title: "10 Free Car Washes",
    desc: "Premium exterior wash included every month on demand",
    highlight: true,
  },
  {
    icon: Star,
    title: "Priority Booking",
    desc: "Skip the queue — get same-day appointments",
  },
  {
    icon: Award,
    title: "Member Discounts",
    desc: "Up to 20% off on all services year-round",
  },
  {
    icon: CheckCircle2,
    title: "Free Annual Inspection",
    desc: "Complete 50-point vehicle health check for free",
  },
  {
    icon: Truck,
    title: "Doorstep Service",
    desc: "We pick up and drop off your vehicle",
  },
  {
    icon: Shield,
    title: "Accident Support",
    desc: "24/7 emergency roadside assistance",
  },
  {
    icon: Phone,
    title: "Dedicated Support",
    desc: "Direct phone line to your service advisor",
  },
  {
    icon: Star,
    title: "Birthday Bonus",
    desc: "1 extra free wash on your birthday every year",
  },
];

const FAQ = [
  {
    id: "redeem",
    q: "How do I redeem my free car washes?",
    a: "When booking any service, you'll see an option to redeem a free car wash from your membership. Simply toggle it on during booking.",
  },
  {
    id: "share",
    q: "Can I share my membership?",
    a: "Memberships are linked to your account. Each vehicle owner must have their own membership for benefits.",
  },
  {
    id: "after-washes",
    q: "What happens after 10 washes are used?",
    a: "You can continue using all other membership benefits. Additional washes are available at member-discounted rates.",
  },
  {
    id: "renewal",
    q: "Is there an auto-renewal?",
    a: "Memberships do not auto-renew. You'll receive a reminder 30 days before expiry to renew for the next year.",
  },
];

export function MembershipPage() {
  const purchaseMembership = usePurchaseMembership();
  const { data: membership } = useCallerMembership();
  const { identity, login } = useInternetIdentity();

  const isActive = membership?.activated;

  const handlePurchase = async () => {
    if (!identity) {
      login();
      return;
    }
    try {
      await purchaseMembership.mutateAsync();
      toast.success("Welcome to car360 Premium! 🎉");
    } catch {
      toast.error("Purchase failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      {/* Hero */}
      <section
        className="bg-dark-300 py-20 text-center relative overflow-hidden"
        data-ocid="membership.section"
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, oklch(0.44 0.18 22), oklch(0.44 0.18 22) 1px, transparent 1px, transparent 40px)",
          }}
        />
        <div className="relative container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Badge className="mb-4 bg-crimson-600/20 text-crimson-300 border-crimson-600/30">
              Premium Membership
            </Badge>
            <h1 className="font-display font-bold text-5xl md:text-6xl text-white mb-4">
              car360 <span className="text-crimson-400">Premium</span>
            </h1>
            <div className="flex items-baseline gap-2 justify-center mb-6">
              <span className="text-6xl font-display font-bold text-white">
                ₹1,100
              </span>
              <span className="text-white/50 text-xl">/year</span>
            </div>
            <p className="text-white/70 text-lg max-w-xl mx-auto mb-8">
              The smartest way to maintain your car. 10 free washes alone save
              you ₹2,000+.
            </p>
            {isActive ? (
              <div className="inline-flex items-center gap-2 bg-green-600/20 text-green-300 border border-green-600/30 rounded-full px-6 py-3">
                <CheckCircle2 className="w-5 h-5" />
                You're a Premium Member!
              </div>
            ) : (
              <Button
                size="lg"
                onClick={handlePurchase}
                disabled={purchaseMembership.isPending}
                className="bg-crimson-600 hover:bg-crimson-700 text-white px-10 py-6 text-lg font-semibold"
                data-ocid="membership.primary_button"
              >
                {purchaseMembership.isPending ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : null}
                {purchaseMembership.isPending
                  ? "Processing..."
                  : "Join Now — ₹1,100/yr"}
              </Button>
            )}
          </motion.div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="font-display font-bold text-3xl text-center text-foreground mb-12">
            Everything You Get
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {BENEFITS.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                data-ocid={`membership.benefits.item.${i + 1}`}
              >
                <Card
                  className={`h-full ${
                    b.highlight
                      ? "border-crimson-200 bg-crimson-50/50"
                      : "border-border"
                  }`}
                >
                  <CardContent className="p-5">
                    <div
                      className={`w-10 h-10 rounded-lg ${
                        b.highlight ? "bg-crimson-600" : "bg-muted"
                      } flex items-center justify-center mb-3`}
                    >
                      <b.icon
                        className={`w-5 h-5 ${
                          b.highlight ? "text-white" : "text-muted-foreground"
                        }`}
                      />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {b.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">{b.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="font-display font-bold text-3xl text-center text-foreground mb-10">
            Common Questions
          </h2>
          <div className="space-y-4">
            {FAQ.map((item, i) => (
              <Card key={item.id} data-ocid={`membership.faq.item.${i + 1}`}>
                <CardContent className="p-5">
                  <h3 className="font-semibold text-foreground mb-2">
                    {item.q}
                  </h3>
                  <p className="text-muted-foreground text-sm">{item.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          {!isActive && (
            <div className="text-center mt-10">
              <Button
                size="lg"
                onClick={handlePurchase}
                disabled={purchaseMembership.isPending}
                className="bg-crimson-600 hover:bg-crimson-700 text-white px-8"
                data-ocid="membership.secondary_button"
              >
                {purchaseMembership.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Get Premium Now
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
