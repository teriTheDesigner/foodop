"use client";

import { IconChartBar, IconFolder, IconListDetails, IconUsers, type Icon } from "@tabler/icons-react";
import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function NavMain() {
  const pathname = usePathname();
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/dashboard">
              <SidebarMenuButton
                tooltip="Dashboard"
                className={`${
                  pathname === "/dashboard"
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
                    : ""
                }`}
              >
                <IconChartBar />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/dashboard/users">
              <SidebarMenuButton
                tooltip="Users"
                className={`${
                  pathname === "/dashboard/users"
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
                    : ""
                } `}
              >
                <IconListDetails />
                <span>Users</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/dashboard/subscriptions">
              <SidebarMenuButton
                tooltip="Subscriptions"
                className={`${
                  pathname === "/dashboard/subscriptions"
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
                    : ""
                }`}
              >
                <IconFolder />
                <span>Subscriptions</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/dashboard/team">
              <SidebarMenuButton
                tooltip="Team"
                className={`${
                  pathname === "/dashboard/team"
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
                    : ""
                }`}
              >
                <IconUsers />
                <span>Team</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
