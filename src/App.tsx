import { useState } from "react";

import { useAppDispatch, useAppSelector } from "./app/hooks";
import { selectToast } from "./app/store";
import AppShell from "./components/layout/AppShell";
import Toast from "./components/ui/Toast";
import Accounts from "./features/accounts/Accounts";
import { toastDismissed, toastShown } from "./features/ui/uiSlice";

function App() {
  const dispatch = useAppDispatch();
  const toast = useAppSelector(selectToast);
  const [activeView, setActiveView] = useState("Accounts");

  const handleNavigate = (label: string) => {
    if (label === "Accounts") {
      setActiveView(label);
      return;
    }
    dispatch(toastShown(`${label} is coming soon`));
  };

  const handleDismissToast = () => {
    dispatch(toastDismissed());
  };

  return (
    <AppShell activeLabel={activeView} onNavigate={handleNavigate}>
      <Accounts />
      <Toast toast={toast} onDismiss={handleDismissToast} />
    </AppShell>
  );
}

export default App;
