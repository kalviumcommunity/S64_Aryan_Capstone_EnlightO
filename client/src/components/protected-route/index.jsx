import { Navigate, useLocation } from "react-router-dom";

/**
 * ProtectedRoute component ensures users are authenticated before accessing protected content.
 * If not authenticated, it redirects to the login page with the original destination saved.
 */
function ProtectedRoute({ authenticated, children }) {
  const location = useLocation();

  if (!authenticated) {
    // Redirect to login page and save the location they were trying to access
    return <Navigate to="/auth" state={{ from: location.pathname }} />;
  }

  return children;
}

export default ProtectedRoute; 