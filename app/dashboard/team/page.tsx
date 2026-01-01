"use client";

import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "@/app/lib/supabase";
import { setEmployees, removeEmployee } from "@/app/store/store";
import { RootState, AppDispatch } from "@/app/store/store";
import { Plus, Search, MoreVertical, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { TeamDialog } from "@/components/TeamDialog";

export default function TeamPage() {
  const dispatch = useDispatch<AppDispatch>();
  const employees = useSelector((state: RootState) => state.employees.employees);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      const { data, error } = await supabase.from("employees").select(`id, full_name, email, role, created_at`);
      if (error) {
        toast("Error fetching employees:" + error.message);
        dispatch(setEmployees([]));
      } else {
        dispatch(setEmployees(data || []));
      }
    };

    fetchEmployees();
  }, [dispatch]);

  const filteredEmployees = useMemo(() => {
    return employees.filter(
      (employee) =>
        employee.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || employee.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, employees]);

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setDialogOpen(true);
  };

  const handleEditEmployee = (employee: any) => {
    setSelectedEmployee(employee);
    setDialogOpen(true);
  };

  const saveUpdatedEmployee = async (employeeData: any) => {
    const { error: updateError } = await supabase
      .from("employees")
      .update({
        full_name: employeeData.full_name,
        email: employeeData.email,
        role: employeeData.role,
      })
      .eq("id", employeeData.id);

    if (updateError) {
      toast(`Failed to update employee: ${updateError.message}`);
      return;
    }

    toast("Employee updated successfully");
  };

  const createNewEmployee = async (employeeData: any) => {
    const { data, error } = await supabase.auth.signUp({ email: employeeData.email.trim(), password: "TemporaryPassword123!" });

    if (error) {
      toast(`Failed to create employee: ${error.message}`);
      setLoading(false);
      return;
    }

    if (!data.user) {
      toast("Failed to create employee");
      setLoading(false);
      return;
    }

    const { error: employeeError } = await supabase.from("employees").insert([
      {
        id: data.user.id,
        full_name: employeeData.full_name,
        email: employeeData.email,
        role: employeeData.role,
      },
    ]);

    if (employeeError) toast(`Employee profile could not be created: ${employeeError.message}`);
    else {
      toast("Employee created successfully");
    }
  };

  const handleSaveEmployee = async (employeeData: any) => {
    if (selectedEmployee) {
      await saveUpdatedEmployee(employeeData);
    } else {
      await createNewEmployee(employeeData);
    }

    const { data } = await supabase.from("employees").select(`id, full_name, email, role, created_at`);

    dispatch(setEmployees(data ?? []));
    setDialogOpen(false);
  };

  const handleDeleteEmployee = (employeeId: string) => {
    toast("Are you sure you want to delete this employee?", {
      action: {
        label: "Delete",
        onClick: async () => {
          const { error } = await supabase.from("employees").delete().eq("id", employeeId);

          if (error) {
            toast("Failed to delete employee: " + error.message);
          } else {
            dispatch(removeEmployee(employeeId));
            toast("Employee deleted successfully");
          }
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => {},
      },
    });
  };

  return (
    <div className="space-y-6 m-4 md:m-6 ">
      <div className="flex justify-between items-start ">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Team</h1>
          <p className="text-muted-foreground mt-2">Manage your team and their information</p>
        </div>
        <Button onClick={handleAddEmployee} className="gap-2">
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
              {filteredEmployees.length} {filteredEmployees.length === 1 ? "colleague" : "colleagues"}
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
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Joined</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-4 px-4 font-medium">{employee.full_name}</td>
                    <td className="py-4 px-4 text-muted-foreground">
                      <div className="flex flex-col gap-1">
                        <span>{employee.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-muted-foreground">
                      <div className="flex flex-col gap-1">
                        <span>{employee.role}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-muted-foreground">{new Date(employee.created_at).toLocaleDateString()}</td>
                    <td className="py-4 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditEmployee(employee)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteEmployee(employee.id)} className="text-destructive">
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

      <TeamDialog open={dialogOpen} onOpenChange={setDialogOpen} employee={selectedEmployee} onSave={handleSaveEmployee} />
    </div>
  );
}
