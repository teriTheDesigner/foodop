"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "@/app/lib/supabase";
import { setUsers } from "@/app/store/store";
import { RootState, AppDispatch } from "@/app/store/store";

export default function UsersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const users = useSelector((state: RootState) => state.users.users);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from("users").select(`
    id,
    full_name,
    email,
    phone,
    status,
    created_at,
    user_subscriptions (
      id,
      status,
      start_date,
      renewal_date,
      subscription_plans (
        id,
        name,
        price
      )
    )
  `);

      if (error) {
        console.error("Error fetching users:", error.message);
      } else {
        dispatch(setUsers(data));
      }
    };

    fetchUsers();
  }, [dispatch]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <ul className="space-y-4">
        {users.map((user) => (
          <li key={user.id} className="border p-4 rounded">
            <p className="font-semibold">{user.full_name}</p>
            <p className="text-sm text-gray-600">{user.email}</p>
            <p className="text-sm">📞 {user.phone || "No phone"}</p>
            <p className="text-sm">Status: {user.status}</p>
            {user.user_subscriptions?.length > 0 && (
              <div className="mt-2">
                <p className="font-medium">Subscriptions:</p>
                <ul className="ml-4 list-disc">
                  {user.user_subscriptions.map((sub: any) => (
                    <li key={sub.id}>
                      {sub.subscription_plans.name} –{" "}
                      {sub.subscription_plans.price} DKK
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
