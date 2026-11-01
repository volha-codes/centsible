import { Navigate, Outlet } from "react-router";

import { useAppSelector } from "../../app/hooks";
import { selectAuthStatus } from "../../features/auth/authSlice";
import PageLoader from "../ui/PageLoader";

const PublicLayout = () => {
  const authStatus = useAppSelector(selectAuthStatus);

  const gettingAuthContent = () => {
    if (authStatus === "unknown") {
      return <PageLoader />;
    } else if (authStatus === "authenticated") {
      return <Navigate to="/accounts" replace />;
    } else {
      return <Outlet />;
    }
  };

  return gettingAuthContent();
};

export default PublicLayout;
