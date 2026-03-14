import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Award,
  Car,
  CheckCircle2,
  ChevronRight,
  Droplets,
  Package,
  Shield,
  Star,
  Truck,
  Users,
  Wind,
  Wrench,
} from "lucide-react";
import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  ServiceCategory,
  useAllServices,
  usePurchaseMembership,
} from "../hooks/useQueries";

const SERVICE_CATEGORIES = [
  {
    id: ServiceCategory.wash,
    label: "Wash & Detailing",
    icon: Droplets,
    desc: "Full exterior & interior detailing, foam wash, ceramic coating",
    color: "bg-blue-500/10 text-blue-400",
  },
  {
    id: ServiceCategory.tires,
    label: "Tire Services",
    icon: Car,
    desc: "Rotation, balancing, alignment, puncture repair, new tyres",
    color: "bg-yellow-500/10 text-yellow-400",
  },
  {
    id: ServiceCategory.oil,
    label: "Oil & Fluids",
    icon: Droplets,
    desc: "Engine oil change, coolant flush, brake fluid, transmission fluid",
    color: "bg-orange-500/10 text-orange-400",
  },
  {
    id: ServiceCategory.brakes,
    label: "Brakes",
    icon: Shield,
    desc: "Pad replacement, disc resurfacing, brake fluid, caliper service",
    color: "bg-crimson-500/10 text-crimson-400",
  },
  {
    id: ServiceCategory.ac,
    label: "AC & Electrical",
    icon: Wind,
    desc: "AC regas, compressor repair, battery, alternator, wiring",
    color: "bg-cyan-500/10 text-cyan-400",
  },
  {
    id: ServiceCategory.body,
    label: "Body & Paint",
    icon: Car,
    desc: "Dent removal, scratch repair, full respray, bumper work",
    color: "bg-purple-500/10 text-purple-400",
  },
  {
    id: ServiceCategory.accessories,
    label: "Car Accessories",
    icon: Package,
    desc: "Seat covers, dash cams, parking sensors, music systems",
    color: "bg-green-500/10 text-green-400",
  },
  {
    id: ServiceCategory.suspension,
    label: "Suspension & Steering",
    icon: Wrench,
    desc: "Shock absorbers, bushings, ball joints, power steering repair",
    color: "bg-teal-500/10 text-teal-400",
  },
];

const MEMBERSHIP_BENEFITS = [
  { icon: Droplets, text: "10 Free Car Washes", highlight: true },
  { icon: Star, text: "Priority Booking" },
  { icon: Award, text: "Member Discounts" },
  { icon: CheckCircle2, text: "Free Annual Inspection" },
  { icon: Truck, text: "Doorstep Service" },
  { icon: Shield, text: "24/7 Support" },
];

const WHY_US = [
  {
    icon: Package,
    stat: "500+",
    label: "Services",
    desc: "Comprehensive catalog across all categories",
  },
  {
    icon: Award,
    stat: "Expert",
    label: "Technicians",
    desc: "Certified mechanics with 10+ years experience",
  },
  {
    icon: Truck,
    stat: "Doorstep",
    label: "Service",
    desc: "We come to your home or office",
  },
  {
    icon: Users,
    stat: "10,000+",
    label: "Happy Customers",
    desc: "Trusted by families across the city",
  },
];

interface LandingPageProps {
  onBookService: () => void;
  onNavigate: (page: string) => void;
}

export function LandingPage({ onBookService, onNavigate }: LandingPageProps) {
  const { data: services = [] } = useAllServices();
  const purchaseMembership = usePurchaseMembership();
  const { identity, login } = useInternetIdentity();

  const countByCategory = (cat: ServiceCategory) =>
    services.filter((s) => s.category === cat).length;

  const handleJoinMembership = async () => {
    if (!identity) {
      login();
      return;
    }
    try {
      await purchaseMembership.mutateAsync();
      toast.success("Welcome to car360 Premium! 10 car washes activated.");
      onNavigate("dashboard");
    } catch {
      toast.error("Membership purchase failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url("/assets/generated/hero-bg.dim_1600x900.jpg")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        data-ocid="hero.section"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-dark-300/80 via-dark-300/60 to-dark-300/95" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Badge className="mb-6 bg-crimson-600/20 text-crimson-300 border-crimson-600/30 text-sm px-4 py-1.5">
              India's #1 Car Service Platform
            </Badge>
            <h1 className="font-display font-bold text-5xl md:text-7xl text-white leading-tight mb-6">
              Your Car Deserves
              <br />
              <span className="text-gradient-crimson">the Best</span>
            </h1>
            <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Professional car care at your doorstep. From routine wash to full
              engine overhaul — 500+ services by certified experts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={onBookService}
                className="bg-crimson-600 hover:bg-crimson-700 text-white px-8 py-6 text-base font-semibold shadow-crimson-lg"
                data-ocid="hero.primary_button"
              >
                Book a Car Wash <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => onNavigate("membership")}
                className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-base font-semibold"
                data-ocid="hero.secondary_button"
              >
                Get Membership — ₹1,100/yr
              </Button>
            </div>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            {WHY_US.map((item) => (
              <div
                key={item.stat}
                className="glass-card rounded-xl p-4 text-center"
              >
                <div className="text-crimson-400 font-display font-bold text-2xl">
                  {item.stat}
                </div>
                <div className="text-white/60 text-xs mt-1">{item.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section
        className="py-24 bg-white"
        id="services"
        data-ocid="services.section"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-crimson-50 text-crimson-600 border-crimson-200">
              All Services
            </Badge>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-foreground mb-4">
              Complete Car Care Under One Roof
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Every service your car needs, delivered by professionals.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {SERVICE_CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                data-ocid={`services.item.${i + 1}`}
              >
                <Card
                  className="service-card-hover cursor-pointer border-border hover:border-crimson-200 group h-full"
                  onClick={onBookService}
                >
                  <CardContent className="p-5">
                    <div
                      className={`w-10 h-10 rounded-lg ${cat.color} flex items-center justify-center mb-3`}
                    >
                      <cat.icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-display font-semibold text-sm text-foreground mb-1 group-hover:text-crimson-600 transition-colors">
                      {cat.label}
                    </h3>
                    <p className="text-muted-foreground text-xs leading-relaxed mb-3">
                      {cat.desc}
                    </p>
                    {countByCategory(cat.id) > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {countByCategory(cat.id)} services
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Membership Section */}
      <section
        className="py-24 bg-dark-300 relative overflow-hidden"
        id="membership"
        data-ocid="membership.section"
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, oklch(0.44 0.18 22), oklch(0.44 0.18 22) 1px, transparent 1px, transparent 40px)",
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Badge className="mb-4 bg-crimson-600/20 text-crimson-300 border-crimson-600/30">
                  Premium Membership
                </Badge>
                <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">
                  Join car360 <span className="text-crimson-400">Premium</span>
                </h2>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-5xl font-display font-bold text-white">
                    ₹1,100
                  </span>
                  <span className="text-white/50 text-lg">/year</span>
                </div>
                <p className="text-white/70 mb-8 leading-relaxed">
                  Unlock exclusive benefits including 10 free car washes,
                  priority bookings, and special member discounts all year long.
                </p>
                <ul className="space-y-3 mb-8">
                  {MEMBERSHIP_BENEFITS.map((benefit) => (
                    <li key={benefit.text} className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${benefit.highlight ? "bg-crimson-600" : "bg-white/10"}`}
                      >
                        <benefit.icon className="w-4 h-4 text-white" />
                      </div>
                      <span
                        className={`text-sm ${benefit.highlight ? "text-white font-semibold" : "text-white/70"}`}
                      >
                        {benefit.text}
                      </span>
                    </li>
                  ))}
                </ul>
                <Button
                  size="lg"
                  onClick={handleJoinMembership}
                  disabled={purchaseMembership.isPending}
                  className="bg-amber-500 hover:bg-amber-400 text-black px-8 py-6 text-base font-bold shadow-lg"
                  data-ocid="membership.primary_button"
                >
                  {purchaseMembership.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {purchaseMembership.isPending
                    ? "Processing..."
                    : "Join Now — ₹1,100/yr"}
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <img
                  src="/assets/generated/membership-card.dim_600x400.jpg"
                  alt="Membership Card"
                  className="rounded-2xl shadow-crimson-lg w-full"
                />
                <div className="absolute -bottom-4 -right-4 bg-crimson-600 text-white rounded-xl p-4 shadow-crimson">
                  <div className="text-2xl font-display font-bold">10</div>
                  <div className="text-xs opacity-80">Free Washes</div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-background" data-ocid="why.section">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-crimson-50 text-crimson-600 border-crimson-200">
              Why car360
            </Badge>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-foreground">
              Built for Drivers Who Care
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_US.map((item, i) => (
              <motion.div
                key={item.stat}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Card className="text-center p-6 border-border hover:border-crimson-200 transition-colors group">
                  <CardContent className="p-0">
                    <div className="w-12 h-12 rounded-full bg-crimson-50 flex items-center justify-center mx-auto mb-4 group-hover:bg-crimson-600 transition-colors">
                      <item.icon className="w-6 h-6 text-crimson-600 group-hover:text-white transition-colors" />
                    </div>
                    <div className="font-display font-bold text-3xl text-crimson-600 mb-1">
                      {item.stat}
                    </div>
                    <div className="font-semibold text-foreground mb-2">
                      {item.label}
                    </div>
                    <p className="text-muted-foreground text-sm">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
