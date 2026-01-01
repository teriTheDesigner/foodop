"use client";

import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "@/app/lib/supabase";
import { setUsers, removeUser } from "@/app/store/store";
import { RootState, AppDispatch } from "@/app/store/store";
import { Plus, Search, MoreVertical, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { UserDialog } from "@/components/UserDialog";
import { toast } from "sonner";

export default function UsersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const users = useSelector((state: RootState) => state.users.users);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
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
          start_date,
          renewal_date,
          subscription_plans (
            id,
            name,
            price
          )
        )
      `
        )
        .order("created_at", { ascending: false });
      if (error) {
        toast("Error fetching users:" + error.message);
        dispatch(setUsers([]));
      } else {
        dispatch(setUsers(data || []));
      }
    };

    fetchUsers();
  }, [dispatch]);

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.phone && user.phone.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery, users]);

  const handleAddUser = () => {
    setSelectedUser(null);
    setDialogOpen(true);
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const saveUpdatedUser = async (userData: any, planIds: string[]) => {
    const { error: updateError } = await supabase
      .from("users")
      .update({
        full_name: userData.full_name,
        email: userData.email,
        phone: userData.phone,
        status: userData.status,
      })
      .eq("id", userData.id);

    if (updateError) {
      toast(`Failed to update user: ${updateError.message}`);
      return;
    }

    const { error: deleteError } = await supabase.from("user_subscriptions").delete().eq("user_id", userData.id);

    if (deleteError) {
      toast(`Failed to remove old subscriptions: ${deleteError.message}`);
      return;
    }

    const newSubs = planIds.map((pid) => ({
      user_id: userData.id,
      plan_id: pid,
      status: "active",
    }));

    const { error: insertError } = await supabase.from("user_subscriptions").insert(newSubs);
    if (insertError) {
      toast(`Failed to add subscriptions: ${insertError.message}`);
      return;
    }

    toast("User updated successfully");
  };

  const createNewUser = async (userData: any, planIds: string[]) => {
    const { id, ...dataWithoutId } = userData;

    const { data: created, error: insertError } = await supabase.from("users").insert(dataWithoutId).select().single();

    if (insertError) {
      toast(`Failed to create user: ${insertError.message}`);
      return;
    }

    const newSubs = planIds.map((pid) => ({
      user_id: created.id,
      plan_id: pid,
      status: "active",
    }));

    const { error: subError } = await supabase.from("user_subscriptions").insert(newSubs);
    if (subError) {
      toast(`Failed to assign subscriptions: ${subError.message}`);
      return;
    }

    toast("User created successfully");
  };

  const handleSaveUser = async (userData: any, planIds: string[]) => {
    if (selectedUser) {
      await saveUpdatedUser(userData, planIds);
    } else {
      await createNewUser(userData, planIds);
    }

    const { data } = await supabase
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

    dispatch(setUsers(data ?? []));
    setDialogOpen(false);
  };

  const handleDeleteUser = (userId: string) => {
    toast("Are you sure you want to delete this user?", {
      action: {
        label: "Delete",
        onClick: async () => {
          const { error } = await supabase.from("users").delete().eq("id", userId);

          if (error) {
            toast("Failed to delete user: " + error.message);
          } else {
            dispatch(removeUser(userId));
            toast("User deleted successfully");
          }
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => {},
      },
    });
  };

  const getStatusColor = (status: string) => {
    return status === "active" ? "bg-green-100 text-green-800" : status === "inactive" ? "bg-gray-100 text-gray-800" : "bg-red-100 text-red-800";
  };

  return (
    <div className="space-y-6 m-4 md:m-6 ">
      <div className="flex justify-between items-start ">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Users</h1>
          <p className="text-muted-foreground mt-2">Manage your users and their subscriptions</p>
        </div>
        <Button onClick={handleAddUser} className="gap-2">
          <Plus className="h-4 w-4" />
          Add New
        </Button>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search users..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
            </div>
            <CardTitle className="text-muted-foreground font-normal">
              {filteredUsers.length} {filteredUsers.length === 1 ? "user" : "users"}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-sm">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Contact</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Subscription</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Joined</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-4 px-4 font-medium">{user.full_name}</td>
                    <td className="py-4 px-4 text-muted-foreground">
                      <div className="flex flex-col gap-1">
                        <span>{user.email}</span>
                        <span>{user.phone}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {user.user_subscriptions && user.user_subscriptions.length > 0 ? (
                        <div className="flex flex-col gap-1">
                          {user.user_subscriptions.map((sub: any) => (
                            <Badge key={sub.id} className="bg-zinc-100 text-zinc-800">
                              {sub.subscription_plans?.name}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">No subscriptions</span>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                    </td>
                    <td className="py-4 px-4 text-muted-foreground">{new Date(user.created_at).toLocaleDateString()}</td>
                    <td className="py-4 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditUser(user)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteUser(user.id)} className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <UserDialog open={dialogOpen} onOpenChange={setDialogOpen} user={selectedUser} onSave={handleSaveUser} />
    </div>
  );
}
