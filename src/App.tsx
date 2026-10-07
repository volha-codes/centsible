import { Navigate, Route, Routes } from "react-router";

import { useAppDispatch, useAppSelector } from "./app/hooks";
import { selectToast } from "./app/store";
import AppShell from "./components/layout/AppShell";
import Page from "./components/layout/Page";
import Toast from "./components/ui/Toast";
import Accounts from "./features/accounts/Accounts";
import Categories from "./features/categories/Categories";
import { toastDismissed } from "./features/ui/uiSlice";

function App() {
  const dispatch = useAppDispatch();
  const toast = useAppSelector(selectToast);

  const handleDismissToast = () => {
    dispatch(toastDismissed());
  };

  return (
    <AppShell>
      <Routes>
        <Route
          path="/accounts"
          element={
            <Page title="Accounts">
              <Accounts />
            </Page>
          }
        />
        <Route
          path="/categories"
          element={
            <Page title="Categories">
              <Categories />
            </Page>
          }
        />
        <Route path="*" element={<Navigate to="/accounts" replace />} />
      </Routes>

      {toast && <Toast toast={toast} onDismiss={handleDismissToast} />}
    </AppShell>
  );
}

export default App;
