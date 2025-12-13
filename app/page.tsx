"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { supabase } from "./lib/supabase";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      router.replace(data.session ? "/dashboard" : "/login");
    };
    checkSession();
  }, [router]);
}
