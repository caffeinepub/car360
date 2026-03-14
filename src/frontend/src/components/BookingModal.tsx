import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  type Membership,
  ServiceCategory,
  useAllServices,
  useBookService,
  useRedeemCarWash,
} from "../hooks/useQueries";

const CATEGORIES: { value: ServiceCategory; label: string }[] = [
  { value: ServiceCategory.wash, label: "Wash & Detailing" },
  { value: ServiceCategory.tires, label: "Tire Services" },
  { value: ServiceCategory.oil, label: "Oil & Fluids" },
  { value: ServiceCategory.brakes, label: "Brakes" },
  { value: ServiceCategory.ac, label: "AC & Electrical" },
  { value: ServiceCategory.body, label: "Body & Paint" },
  { value: ServiceCategory.accessories, label: "Car Accessories" },
  { value: ServiceCategory.suspension, label: "Suspension & Steering" },
];

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  membership: Membership | null | undefined;
  preselectedCategory?: ServiceCategory;
}

export function BookingModal({
  open,
  onClose,
  membership,
  preselectedCategory,
}: BookingModalProps) {
  const [category, setCategory] = useState<ServiceCategory | "">(
    preselectedCategory || "",
  );
  const [serviceId, setServiceId] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [carModel, setCarModel] = useState("");
  const [date, setDate] = useState("");
  const [redeemWash, setRedeemWash] = useState(false);

  const { data: allServices = [] } = useAllServices();
  const bookService = useBookService();
  const redeemCarWash = useRedeemCarWash();

  const filteredServices = category
    ? allServices.filter((s) => s.category === category)
    : allServices;
  const canRedeem =
    membership?.activated && Number(membership.remainingCarWashes) > 0;

  const handleSubmit = async () => {
    if (!name || !phone || !carModel || !date || !serviceId) {
      toast.error("Please fill all fields");
      return;
    }
    const dateMs = BigInt(new Date(date).getTime()) * BigInt(1_000_000);
    try {
      const booking = await bookService.mutateAsync({
        name,
        phone,
        carModel,
        date: dateMs,
        serviceId: BigInt(serviceId),
      });
      if (redeemWash && canRedeem) {
        await redeemCarWash.mutateAsync(booking.id);
      }
      toast.success("Booking confirmed! We'll contact you shortly.");
      onClose();
    } catch {
      toast.error("Booking failed. Please try again.");
    }
  };

  const isPending = bookService.isPending || redeemCarWash.isPending;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg" data-ocid="booking.dialog">
        <DialogHeader>
          <DialogTitle className="text-xl font-display">
            Book a Car Wash
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Category</Label>
              <Select
                value={category}
                onValueChange={(v) => {
                  setCategory(v as ServiceCategory);
                  setServiceId("");
                }}
              >
                <SelectTrigger data-ocid="booking.select">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Service</Label>
              <Select
                value={serviceId}
                onValueChange={setServiceId}
                disabled={filteredServices.length === 0}
              >
                <SelectTrigger data-ocid="booking.service.select">
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  {filteredServices.map((s) => (
                    <SelectItem key={String(s.id)} value={String(s.id)}>
                      {s.name} — ₹{String(s.price)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Your Name</Label>
              <Input
                data-ocid="booking.input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rajesh Kumar"
              />
            </div>
            <div className="space-y-1">
              <Label>Phone</Label>
              <Input
                data-ocid="booking.phone.input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Car Model</Label>
              <Input
                data-ocid="booking.car.input"
                value={carModel}
                onChange={(e) => setCarModel(e.target.value)}
                placeholder="Maruti Swift 2022"
              />
            </div>
            <div className="space-y-1">
              <Label>Date</Label>
              <Input
                data-ocid="booking.date.input"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>
          {canRedeem && (
            <div className="flex items-center gap-3 rounded-lg bg-crimson-50 border border-crimson-200 px-4 py-3">
              <Switch
                data-ocid="booking.switch"
                checked={redeemWash}
                onCheckedChange={setRedeemWash}
                id="redeem-wash"
              />
              <Label htmlFor="redeem-wash" className="cursor-pointer">
                Redeem 1 free car wash ({String(membership?.remainingCarWashes)}{" "}
                remaining)
              </Label>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            data-ocid="booking.cancel_button"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="bg-crimson-600 hover:bg-crimson-700 text-white"
            data-ocid="booking.submit_button"
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {isPending ? "Booking..." : "Confirm Booking"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
