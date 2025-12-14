"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface TeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: any | null;
  onSave: (employee: any) => void;
}

export function TeamDialog({ open, onOpenChange, employee, onSave }: TeamDialogProps) {
  const [formData, setFormData] = useState({
    id: "",
    full_name: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        id: employee.id,
        full_name: employee.full_name,
        email: employee.email,
        role: employee.role,
      });
    } else {
      setFormData({
        id: "",
        full_name: "",
        email: "",
        role: "",
      });
    }
  }, [employee]);

  const handleSubmit = () => {
    if (!formData.full_name || !formData.email) {
      toast.error("Name and email are required.");
      return;
    }
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{employee ? "Edit Employee" : "Add Employee"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Full Name</label>
            <Input
              name="full_name"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              placeholder="John Smith"
              className="placeholder:text-gray-400  text-muted-foreground"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Email</label>
            <Input
              name="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john@example.com"
              className="placeholder:text-gray-400  text-muted-foreground"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Role</label>
            <Input
              name="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              placeholder="SoMe Manager"
              className="placeholder:text-gray-400  text-muted-foreground"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>{employee ? "Save Changes" : "Add Employee"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
