import { Navigate, Outlet } from "react-router-dom";
import { isLoggedIn } from "../../helpers/user.helper";

export default function PrivateRoute({ children }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }
  return children ? children : <Outlet />;
};
