"use client";

import { RootState } from "@/app/store/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useSelector } from "react-redux";

export function NavUser() {
  const admin = useSelector((state: RootState) => state.admin.admin);
  const { isMobile } = useSidebar();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Avatar className="h-6 w-6 rounded-lg grayscale">
            <AvatarImage src="/avatar.svg" alt="Username" />
            <AvatarFallback className="rounded-lg">CN</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">Username</span>
            <span className="text-muted-foreground truncate text-xs">
              {admin?.email}
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
