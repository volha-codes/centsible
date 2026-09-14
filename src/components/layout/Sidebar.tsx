import {
  ChartNoAxesColumn,
  CreditCard,
  HandCoins,
  Home,
  Settings,
  Wallet,
} from "lucide-react";

import { cn } from "../../lib/cn";
import Logo from "../Logo";

const NAV = [
  {
    label: "Dashboard",
    icon: Home,
  },
  {
    label: "Accounts",
    icon: Wallet,
  },
  {
    label: "Transactions",
    icon: CreditCard,
  },
  {
    label: "Budgets",
    icon: HandCoins,
  },
  {
    label: "Reports",
    icon: ChartNoAxesColumn,
  },
  {
    label: "Settings",
    icon: Settings,
  },
];

const Sidebar = ({
  activeLabel,
  onNavigate,
}: {
  activeLabel: string;
  onNavigate: (label: string) => void;
}) => {
  return (
    <aside className="flex w-56 shrink-0 flex-col gap-8 border-r border-border px-5 py-8">
      <div className="flex items-center gap-2.5">
        <Logo className="h-7 w-7" />
        <span className="text-lg font-bold text-content">Centsible</span>
      </div>

      <nav className="flex flex-col gap-1">
        {NAV.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              className={cn(
                "flex h-10 cursor-pointer items-center gap-2 rounded-xl px-3 transition-colors duration-200",
                activeLabel === item.label
                  ? "bg-surface text-primary"
                  : "text-muted hover:bg-surface hover:text-primary",
              )}
              onClick={() => onNavigate(item.label)}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
