"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import { SignupForm } from "@/components/signup-form";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignup = async (
    fullName: string,
    email: string,
    password: string
  ) => {
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });

    if (error) {
      alert("Signup failed: " + error.message);
      setLoading(false);
      return;
    }

    if (!data.user) {
      alert("Signup failed: No user returned");
      setLoading(false);
      return;
    }

    const { error: employeeError } = await supabase.from("employees").insert([
      {
        id: data.user.id,
        full_name: fullName,
        email,
        role: "admin",
      },
    ]);

    if (employeeError)
      alert("Error adding to employees table: " + employeeError.message);
    else {
      alert("Signup successful! Please log in.");
      router.push("/login");
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
            <SignupForm onSubmit={handleSignup} loading={loading} />
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
