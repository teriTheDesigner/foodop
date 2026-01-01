"use client";

import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUsers } from "@/app/store/store";
import { RootState, AppDispatch } from "@/app/store/store";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserDialog } from "@/components/UserDialog";
import { toast } from "sonner";
import TableSkeleton from "@/components/table-skeleton";
import { getStatusColor } from "@/lib/utils";
import { UserRow } from "@/components/UserRow";
import { deleteUser, fetchUsers, saveUser } from "./service";

export default function UsersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const users = useSelector((state: RootState) => state.users.users);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      const usersData = await fetchUsers();
      dispatch(setUsers(usersData));
      setLoading(false);
    };
    loadUsers();
  }, [dispatch]);

  const handleSaveUser = async (userData: any, planIds: string[]) => {
    await saveUser(userData, planIds, !!selectedUser);
    const usersData = await fetchUsers();
    dispatch(setUsers(usersData));
    setDialogOpen(false);
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setDialogOpen(true);
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const handleDeleteUser = (userId: string) => {
    toast("Are you sure?", {
      action: {
        label: "Delete",
        onClick: async () => {
          const success = await deleteUser(userId);
          if (success) dispatch(setUsers(users.filter((user) => user.id !== userId)));
        },
      },
      cancel: { label: "Cancel", onClick: () => {} },
    });
  };

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.phone && user.phone.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery, users]);

  return (
    <div className="space-y-6 m-4 md:m-6 ">
      <div className="flex justify-between items-start ">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Users</h1>
          <p className="text-muted-foreground mt-2">Manage your users and their subscriptions</p>
        </div>
        <Button onClick={handleAddUser} disabled={loading} className="gap-2">
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
                {loading ? (
                  <TableSkeleton />
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <UserRow key={user.id} user={user} onEdit={handleEditUser} onDelete={handleDeleteUser} getStatusColor={getStatusColor} />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <UserDialog open={dialogOpen} onOpenChange={setDialogOpen} user={selectedUser} onSave={handleSaveUser} />
    </div>
  );
}
