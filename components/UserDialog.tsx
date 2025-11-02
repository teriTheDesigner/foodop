"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/app/lib/supabase";
import { Checkbox } from "@/components/ui/checkbox";

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: any | null;
  onSave: (user: any, selectedPlans: string[]) => void;
}

export function UserDialog({
  open,
  onOpenChange,
  user,
  onSave,
}: UserDialogProps) {
  const [formData, setFormData] = useState({
    id: "",
    full_name: "",
    email: "",
    status: "active",
  });

  const [plans, setPlans] = useState<any[]>([]);
  const [selectedPlans, setSelectedPlans] = useState<string[]>([]);

  useEffect(() => {
    const loadPlans = async () => {
      const { data } = await supabase.from("subscription_plans").select("*");
      setPlans(data || []);
    };
    loadPlans();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        status: user.status,
      });

      setSelectedPlans(
        user.user_subscriptions?.map((s: any) => s.subscription_plans.id) || []
      );
    } else {
      setFormData({
        id: "",
        full_name: "",
        email: "",
        status: "active",
      });
      setSelectedPlans([]);
    }
  }, [user]);

  const togglePlan = (planId: string) => {
    setSelectedPlans((prev) =>
      prev.includes(planId)
        ? prev.filter((id) => id !== planId)
        : [...prev, planId]
    );
  };

  const handleSubmit = () => {
    if (!formData.full_name || !formData.email) {
      alert("Name and email are required.");
      return;
    }
    onSave(formData, selectedPlans);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{user ? "Edit User" : "Add User"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Full Name</label>
            <Input
              name="full_name"
              value={formData.full_name}
              onChange={(e) =>
                setFormData({ ...formData, full_name: e.target.value })
              }
              placeholder="Enter full name"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Email</label>
            <Input
              name="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="Enter email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Subscriptions
            </label>

            <div className="space-y-2 border p-3 rounded-md">
              {plans.map((plan) => (
                <label key={plan.id} className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedPlans.includes(plan.id)}
                    onCheckedChange={() => togglePlan(plan.id)}
                  />
                  <span>
                    {plan.name} — {plan.price} DKK
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="w-full border rounded p-2"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {user ? "Save Changes" : "Add User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
