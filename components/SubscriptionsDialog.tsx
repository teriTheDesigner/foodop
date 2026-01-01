"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SubscriptionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: any | null;
  onSave: (plan: any) => void;
}

export function SubscriptionsDialog({ open, onOpenChange, plan, onSave }: SubscriptionsDialogProps) {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    price: "",
  });

  useEffect(() => {
    if (plan) {
      setFormData({
        id: plan.id,
        name: plan.name,
        price: plan.price,
      });
    } else {
      setFormData({
        id: "",
        name: "",
        price: "",
      });
    }
  }, [plan]);

  const handleSubmit = () => {
    if (!formData.name || !formData.price) {
      toast.error("Name and price are required.");
      return;
    }
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{plan ? "Edit Subscription" : "Add Subscription"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Name</label>
            <Input
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Basic Plan"
              className="placeholder:text-gray-400  text-muted-foreground"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Price</label>
            <Input
              name="price"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="1500 DKK"
              className="placeholder:text-gray-400  text-muted-foreground"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>{plan ? "Save Changes" : "Add Subscription"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
