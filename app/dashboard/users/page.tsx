"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "@/app/lib/supabase";
import { setUsers } from "@/app/store/store";
import { RootState } from "@/app/store/store";

export default function UsersPage() {
  const dispatch = useDispatch();
  const users = useSelector((state: RootState) => state.users.users);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from("users").select("*");
      if (error) {
        console.error("Error fetching users:", error.message);
      } else {
        dispatch(setUsers(data));
      }
    };

    fetchUsers();
  }, [dispatch]);

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.full_name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}
