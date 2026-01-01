"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { Button } from "@/components/ui/button";
import { DollarSign, Plus, Users, Utensils, Trash, Leaf, TvMinimal, MoreVertical, Trash2, Edit, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SubscriptionsDialog } from "@/components/SubscriptionsDialog";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store/store";
import { setPlans } from "@/app/store/subscriptionsSlice";

export default function SubscriptionsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const plans = useSelector((state: RootState) => state.subscriptions.plans);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<any | null>(null);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      const { data, error } = await supabase.from("subscription_plans").select(`
        id,
        name,
        price,
        user_subscriptions (
          id,
          status,
          start_date,
          renewal_date
        )
      `);

      if (error) return toast("Failed to fetch subscriptions: " + error.message);

      const withInsights = data.map((plan) => {
        const activeSubscriptions = plan.user_subscriptions.filter((sub: any) => sub.status === "active");
        return {
          ...plan,
          activeCount: activeSubscriptions.length,
          monthlyRevenue: activeSubscriptions.length * plan.price,
        };
      });

      dispatch(setPlans(withInsights));
    };

    fetchSubscriptions();
  }, [dispatch]);

  const handleAddSubscription = () => {
    setSelectedSubscription(null);
    setDialogOpen(true);
  };

  const handleEditSubscription = (plan: any) => {
    setSelectedSubscription(plan);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6 m-4 md:m-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Subscriptions</h1>
          <p className="text-muted-foreground mt-2">Manage your subscriptions</p>
        </div>
        <Button onClick={handleAddSubscription} className="gap-2">
          <Plus className="h-4 w-4" />
          Add New
        </Button>
      </div>

      <div className="grid gap-4">
        {plans.map((plan) => (
          <Card key={plan.id} className="flex flex-row overflow-hidden shadow-card py-0">
            <div className="flex items-center justify-center w-1/4 p-4 bg-primary/5 py-6">
              <div className="flex flex-col gap-2 items-center">
                {plan.name === "Menu Assistant" && <Utensils className="h-6 w-6" />}
                {plan.name === "Food Waste Tracking" && <Trash className="h-6 w-6" />}
                {plan.name === "Sustainability Reporting" && <Leaf className="h-6 w-6" />}
                {plan.name === "Digital Displays" && <TvMinimal className="h-6 w-6" />}

                <span className="mt-2 font-semibold text-sm">{plan.name}</span>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-3 divide-x py-6 font-semibold">
              <div className="p-4 flex flex-col gap-2 justify-center">
                <div className="flex gap-2 items-center text-muted-foreground ">
                  <DollarSign className="h-4 w-4 " />
                  <span className="text-xs">Price</span>
                </div>
                <span className=" text-3xl">{plan.price.toLocaleString()}</span>
                <span className="text-muted-foreground text-xs "> DKK / month</span>
              </div>

              <div className="p-4 flex flex-col gap-2 justify-center font-semibold">
                <div className="flex gap-2 items-center text-muted-foreground ">
                  <Users className="h-4 w-4 " />
                  <span className="text-xs">Active Subs</span>
                </div>
                <span className="text-3xl">{plan.activeCount.toLocaleString()}</span>
                <span className="text-muted-foreground text-xs "> Subs</span>
              </div>

              <div className="p-4 flex flex-col gap-2 justify-center font-semibold">
                <div className="flex gap-2 items-center text-muted-foreground ">
                  <TrendingUp className="h-4 w-4 " />
                  <span className="text-xs ">Monthly Revenue</span>
                </div>
                <span className=" text-3xl">{plan.monthlyRevenue.toLocaleString()}</span>
                <span className="text-muted-foreground text-xs"> DKK</span>
              </div>
            </div>
            <div className="p-4 flex flex-col items-center justify-center py-6">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleEditSubscription(plan)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </Card>
        ))}
      </div>
      {/* <SubscriptionsDialog open={dialogOpen} onOpenChange={setDialogOpen} plan={selectedSubscription} onSave={handleSavePlan} /> */}
    </div>
  );
}
