import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  user_subscriptions: any[];
  activeCount: number;
  monthlyRevenue: number;
}

interface SubscriptionsState {
  plans: SubscriptionPlan[];
}

const initialState: SubscriptionsState = {
  plans: [],
};

const subscriptionsSlice = createSlice({
  name: "subscriptions",
  initialState,
  reducers: {
    setPlans(state, action: PayloadAction<SubscriptionPlan[]>) {
      state.plans = action.payload;
    },
    addPlan(state, action: PayloadAction<SubscriptionPlan>) {
      state.plans.push(action.payload);
    },
    updatePlan(state, action: PayloadAction<SubscriptionPlan>) {
      const index = state.plans.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) state.plans[index] = action.payload;
    },
    removePlan(state, action: PayloadAction<string>) {
      state.plans = state.plans.filter((p) => p.id !== action.payload);
    },
  },
});

export const { setPlans, addPlan, updatePlan, removePlan } = subscriptionsSlice.actions;
export default subscriptionsSlice.reducer;
