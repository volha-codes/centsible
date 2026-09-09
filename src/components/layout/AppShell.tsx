import type { ReactNode } from "react";

import Sidebar from "./Sidebar";
const AppShell = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
};

export default AppShell;
