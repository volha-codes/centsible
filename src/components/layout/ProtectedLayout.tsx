import { Navigate, Outlet } from "react-router";

import { useAppSelector } from "../../app/hooks";
import { selectAuthStatus } from "../../features/auth/authSlice";
import PageLoader from "../ui/PageLoader";
import AppShell from "./AppShell";

const ProtectedLayout = () => {
  const authStatus = useAppSelector(selectAuthStatus);

  const gettingAuthContent = () => {
    if (authStatus === "unknown") {
      return <PageLoader />;
    } else if (authStatus === "anonymous") {
      return <Navigate to="/login" replace />;
    } else {
      return (
        <AppShell>
          <Outlet />
        </AppShell>
      );
    }
  };

  return gettingAuthContent();
};

export default ProtectedLayout;
