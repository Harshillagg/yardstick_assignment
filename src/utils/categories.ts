import {
  ShoppingCart,
  Car,
  Home,
  Utensils,
  Gamepad2,
  Plane,
  GraduationCap,
  Heart,
  DollarSign,
  Gift,
  Briefcase,
  TrendingUp,
  Coffee,
} from "lucide-react";

export const CATEGORIES = [
  "Food & Dining",
  "Shopping",
  "Transportation",
  "Bills & Utilities",
  "Entertainment",
  "Travel",
  "Education",
  "Healthcare",
  "Income",
  "Gifts",
  "Business",
  "Investment",
  "Personal Care",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];

export function getCategoryIcon(category: string) {
  switch (category) {
    case "Food & Dining":
      return Utensils;
    case "Shopping":
      return ShoppingCart;
    case "Transportation":
      return Car;
    case "Bills & Utilities":
      return Home;
    case "Entertainment":
      return Gamepad2;
    case "Travel":
      return Plane;
    case "Education":
      return GraduationCap;
    case "Healthcare":
      return Heart;
    case "Income":
      return DollarSign;
    case "Gifts":
      return Gift;
    case "Business":
      return Briefcase;
    case "Investment":
      return TrendingUp;
    case "Personal Care":
      return Coffee;
    default:
      return DollarSign;
  }
}
