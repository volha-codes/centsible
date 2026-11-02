import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router";

import { useAppDispatch, useAppSelector } from "./app/hooks";
import Page from "./components/layout/Page";
import ProtectedLayout from "./components/layout/ProtectedLayout";
import PublicLayout from "./components/layout/PublicLayout";
import Toast from "./components/ui/Toast";
import Accounts from "./features/accounts/Accounts";
import { fetchMe, selectAuthStatus } from "./features/auth/authSlice";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import Categories from "./features/categories/Categories";
import { selectToast, toastDismissed } from "./features/ui/uiSlice";

function App() {
  const dispatch = useAppDispatch();
  const toast = useAppSelector(selectToast);
  const status = useAppSelector(selectAuthStatus);

  const handleDismissToast = () => {
    dispatch(toastDismissed());
  };

  useEffect(() => {
    if (status === "unknown") void dispatch(fetchMe());
  }, [status, dispatch]);

  return (
    <>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<ProtectedLayout />}>
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
        </Route>

        <Route path="*" element={<Navigate to="/accounts" replace />} />
      </Routes>

      {toast && <Toast toast={toast} onDismiss={handleDismissToast} />}
    </>
  );
}

export default App;
