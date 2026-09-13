import type { ReactNode } from "react";

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
  return (
    <div className="flex min-h-screen overflow-hidden">
      <Sidebar activeLabel={activeLabel} onNavigate={onNavigate} />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
};

export default AppShell;
