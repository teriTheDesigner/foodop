import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getStatusColor = (status: string) => {
  return status === "active" ? "bg-green-100 text-green-800" : status === "inactive" ? "bg-gray-100 text-gray-800" : "bg-red-100 text-red-800";
};
