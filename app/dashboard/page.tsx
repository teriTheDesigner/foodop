"use client";
import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import data from "../data.json";
import { useDispatch } from "react-redux";
import { setAdmin } from "@/app/store/store";

export default function Dashboard() {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push("/login");
      } else {
        dispatch(setAdmin(data.session.user));
      }
    };
    checkSession();
  }, [router, dispatch]);

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <DataTable data={data} />
    </div>
  );
}
