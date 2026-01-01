import { supabase } from "@/app/lib/supabase";
import { toast } from "sonner";

export async function fetchUsers() {
  const { data, error } = await supabase
    .from("users")
    .select(
      `
      id,
      full_name,
      email,
      phone,
      status,
      created_at,
      user_subscriptions (
        id,
        status,
        subscription_plans (id, name, price)
      )
    `
    )
    .order("created_at", { ascending: false });
  if (error) toast(`Error fetching users: ${error.message}`);
  return data ?? [];
}

export async function saveUser(userData: any, planIds: string[], isUpdate: boolean) {
  if (isUpdate) {
    const { error: updateError } = await supabase
      .from("users")
      .update({
        full_name: userData.full_name,
        email: userData.email,
        phone: userData.phone,
        status: userData.status,
      })
      .eq("id", userData.id);

    if (updateError) return toast(`Failed to update user: ${updateError.message}`);

    await supabase.from("user_subscriptions").delete().eq("user_id", userData.id);

    const newSubs = planIds.map((pid) => ({
      user_id: userData.id,
      plan_id: pid,
      status: "active",
    }));

    const { error: insertError } = await supabase.from("user_subscriptions").insert(newSubs);
    if (insertError) return toast(`Failed to add subscriptions: ${insertError.message}`);
    toast("User updated successfully");
  } else {
    const { id, ...dataWithoutId } = userData;
    const { data: created, error: insertError } = await supabase.from("users").insert(dataWithoutId).select().single();

    if (insertError) return toast(`Failed to create user: ${insertError.message}`);

    const newSubs = planIds.map((pid) => ({
      user_id: created.id,
      plan_id: pid,
      status: "active",
    }));

    const { error: subError } = await supabase.from("user_subscriptions").insert(newSubs);
    if (subError) return toast(`Failed to assign subscriptions: ${subError.message}`);
    toast("User created successfully");
  }
}

export async function deleteUser(userId: string) {
  const { error } = await supabase.from("users").delete().eq("id", userId);
  if (error) {
    toast(`Failed to delete user: ${error.message}`);
    return false;
  } else {
    toast("User deleted successfully");
    return true;
  }
}
