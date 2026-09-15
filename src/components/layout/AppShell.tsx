import { Menu } from "lucide-react";
import { useState, type ReactNode } from "react";

import Logo from "../Logo";
import Sidebar from "./Sidebar";

const AppShell = ({
  children,
  activeLabel,
  onNavigate,
}: {
  children: ReactNode;
  activeLabel: string;
  onNavigate: (label: string) => void;
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen overflow-hidden">
      <Sidebar
        activeLabel={activeLabel}
        onNavigate={onNavigate}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex items-center gap-3 border-b border-border p-4 md:hidden">
          <Logo className="h-6 w-6" />
          <span className="font-bold text-content">Centsible</span>

          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setSidebarOpen(true)}
            className="ml-auto cursor-pointer rounded-md p-1.5 text-muted hover:bg-surface hover:text-content"
          >
            <Menu size={20} />
          </button>
        </header>
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
};

export default AppShell;
