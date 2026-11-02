import {
  BookOpen,
  Briefcase,
  Car,
  Clapperboard,
  Coffee,
  Gift,
  House,
  Pill,
  Plane,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  Tag,
  type LucideIcon,
} from "lucide-react";

export const CATEGORY_ICONS = {
  "shopping-cart": ShoppingCart,
  car: Car,
  house: House,
  clapperboard: Clapperboard,
  pill: Pill,
  "shopping-bag": ShoppingBag,
  plane: Plane,
  "book-open": BookOpen,
  briefcase: Briefcase,
  gift: Gift,
  smartphone: Smartphone,
  coffee: Coffee,
} satisfies Record<string, LucideIcon>;

export const CATEGORY_COLORS = {
  red: { swatch: "bg-cat-red", tint: "bg-cat-red/15", text: "text-cat-red" },
  amber: {
    swatch: "bg-cat-amber",
    tint: "bg-cat-amber/15",
    text: "text-cat-amber",
  },
  teal: {
    swatch: "bg-cat-teal",
    tint: "bg-cat-teal/15",
    text: "text-cat-teal",
  },
  lime: {
    swatch: "bg-cat-lime",
    tint: "bg-cat-lime/15",
    text: "text-cat-lime",
  },
  purple: {
    swatch: "bg-cat-purple",
    tint: "bg-cat-purple/15",
    text: "text-cat-purple",
  },
  blue: {
    swatch: "bg-cat-blue",
    tint: "bg-cat-blue/15",
    text: "text-cat-blue",
  },
  orange: {
    swatch: "bg-cat-orange",
    tint: "bg-cat-orange/15",
    text: "text-cat-orange",
  },
  pink: {
    swatch: "bg-cat-pink",
    tint: "bg-cat-pink/15",
    text: "text-cat-pink",
  },
} satisfies Record<string, { swatch: string; tint: string; text: string }>;

export type CategoryIconName = keyof typeof CATEGORY_ICONS;
export type CategoryColorName = keyof typeof CATEGORY_COLORS;

export const ICON_NAMES = Object.keys(CATEGORY_ICONS) as CategoryIconName[];
export const COLOR_NAMES = Object.keys(CATEGORY_COLORS) as CategoryColorName[];

export const DEFAULT_ICON: CategoryIconName = "shopping-cart";
export const DEFAULT_COLOR: CategoryColorName = "red";

const FALLBACK_COLOR = {
  swatch: "bg-muted",
  tint: "bg-muted/15",
  text: "text-muted",
};

export function getCategoryIcon(name: string): LucideIcon {
  return CATEGORY_ICONS[name as CategoryIconName] ?? Tag;
}

export function getCategoryColor(name: string) {
  return CATEGORY_COLORS[name as CategoryColorName] ?? FALLBACK_COLOR;
}
