import { useState } from "react";

import AppShell from "./components/layout/AppShell";
import Toast from "./components/ui/Toast";
import Accounts from "./features/accounts/Accounts";

function App() {
  const [activeView, setActiveView] = useState("Accounts");
  const [toast, setToast] = useState<{ id: number; message: string } | null>(
    null,
  );

  const handleNavigate = (label: string) => {
    if (label === "Accounts") {
      setActiveView(label);
      return;
    }
    setToast({ id: Date.now(), message: `${label} is coming soon` });
  };

  const handleDismissToast = () => {
    setToast(null);
  };

  return (
    <AppShell activeLabel={activeView} onNavigate={handleNavigate}>
      <Accounts />
      <Toast toast={toast} onDismiss={handleDismissToast} />
    </AppShell>
  );
}

export default App;
