import {
  ChartNoAxesColumn,
  CreditCard,
  HandCoins,
  Home,
  LogOut,
  Settings,
  Tags,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { logout, selectUser } from "../../features/auth/authSlice";
import { toastShown } from "../../features/ui/uiSlice";
import { cn } from "../../lib/cn";
import Logo from "../Logo";

const NAV = [
  {
    label: "Dashboard",
    icon: Home,
  },
  {
    label: "Accounts",
    to: "/accounts",
    icon: Wallet,
  },
  {
    label: "Categories",
    to: "/categories",
    icon: Tags,
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

const Sidebar = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await dispatch(logout()).unwrap();
      dispatch(toastShown("You successfully signed out.", "success"));
      navigate("/login", { replace: true });
    } catch {
      dispatch(toastShown("Failed to sign out. Please try again.", "error"));
    } finally {
      setIsLoggingOut(false);
      onClose();
    }
  };

  useEffect(() => {
    if (!open) return;

    const handleKaeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKaeyDown);

    return () => {
      document.removeEventListener("keydown", handleKaeyDown);
    };
  }, [open, onClose]);

  return (
    <>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-56 shrink-0 flex-col gap-8 border-r border-border bg-background px-5 py-8 transition-transform duration-200 md:static md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center gap-2.5">
          <Logo className="h-7 w-7" />
          <span className="text-lg font-bold text-content">Centsible</span>
        </div>

        <nav className="flex flex-col gap-1">
          {NAV.map((item) => {
            const Icon = item.icon;

            return item.to ? (
              <NavLink
                to={item.to}
                key={item.label}
                className={({ isActive }) =>
                  cn(
                    "flex h-10 cursor-pointer items-center gap-2 rounded-xl px-3 transition-colors duration-200",
                    isActive
                      ? "bg-surface text-primary"
                      : "text-muted hover:bg-surface hover:text-primary",
                  )
                }
                onClick={onClose}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </NavLink>
            ) : (
              <button
                key={item.label}
                className="flex h-10 cursor-default items-center gap-2 rounded-xl px-3 text-muted transition-colors duration-200"
                onClick={() => {
                  dispatch(toastShown(`${item.label} is coming soon`));
                  onClose();
                }}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto flex flex-col gap-3 border-t border-border pt-4">
          <div className="flex min-w-0 flex-col px-3">
            <span className="truncate text-sm font-medium text-content">
              {user?.firstName}
            </span>
            <span className="truncate text-xs text-muted">{user?.email}</span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex h-10 cursor-pointer items-center gap-2 rounded-xl px-3 text-muted transition-colors duration-200 hover:bg-surface hover:text-expense disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isLoggingOut}
          >
            <LogOut className="h-4 w-4" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
          onClick={onClose}
        />
      )}
    </>
  );
};

export default Sidebar;
