"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { supabase } from "./lib/supabase";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) router.replace("/login");
    };
    checkSession();
  }, [router]);
}
