"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import { useDispatch } from "react-redux";
import { setUser } from "../store/store";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        dispatch(setUser(data.session.user));
        router.push("/dashboard");
      }
    });
  }, [router]);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) alert("Login failed: " + error.message);
    else if (data.session) {
      dispatch(setUser(data.session.user));
      router.push("/dashboard");
    }

    setLoading(false);
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <img src="/logo.svg" alt="logo" className="w-36" />
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm onSubmit={handleLogin} loading={loading} />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/saronita-viXciChjA1A-unsplash.jpg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover brightness-[0.9]  dark:brightness-[0.2] dark:grayscale "
        />
      </div>
    </div>
  );
}
