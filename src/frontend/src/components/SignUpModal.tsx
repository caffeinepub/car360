import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Car, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useSaveProfile } from "../hooks/useQueries";

interface SignUpModalProps {
  open: boolean;
  onComplete: () => void;
}

export function SignUpModal({ open, onComplete }: SignUpModalProps) {
  const [name, setName] = useState("");
  const saveProfile = useSaveProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await saveProfile.mutateAsync({ name: name.trim() });
      toast.success(`Welcome to car360, ${name.trim()}!`);
      onComplete();
    } catch {
      toast.error("Could not save profile. Please try again.");
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className="sm:max-w-md"
        onPointerDownOutside={(e) => e.preventDefault()}
        data-ocid="signup.dialog"
      >
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-lg bg-crimson-600 flex items-center justify-center">
              <Car className="w-5 h-5 text-white" />
            </div>
            <DialogTitle className="font-display text-xl">
              Welcome to car<span className="text-crimson-600">360</span>
            </DialogTitle>
          </div>
          <DialogDescription>
            Just one quick step to set up your account.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          <div className="space-y-2">
            <Label htmlFor="signup-name">Your Name</Label>
            <Input
              id="signup-name"
              placeholder="e.g. Rahul Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              required
              data-ocid="signup.input"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-crimson-600 hover:bg-crimson-700 text-white font-semibold"
            disabled={saveProfile.isPending || !name.trim()}
            data-ocid="signup.submit_button"
          >
            {saveProfile.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {saveProfile.isPending ? "Saving..." : "Get Started"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
