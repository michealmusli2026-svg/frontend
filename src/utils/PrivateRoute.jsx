import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("userData"); // or from redux/context
  return token ? children : <Navigate to="/trade" replace />;
};

export default PrivateRoute;
