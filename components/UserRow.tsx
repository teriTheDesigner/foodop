import { MoreVertical, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface UserRowProps {
  user: any;
  onEdit: (user: any) => void;
  onDelete: (id: string) => void;
  getStatusColor: (status: string) => string;
}

export function UserRow({ user, onEdit, onDelete, getStatusColor }: UserRowProps) {
  return (
    <tr className="border-b border-border hover:bg-muted/50 transition-colors">
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
            <DropdownMenuItem onClick={() => onEdit(user)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(user.id)} className="text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}
