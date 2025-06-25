import { Navigate, useLocation } from "react-router-dom";
import { Fragment } from "react";

function RouteGuard({ authenticated, user, element }) {
  const location = useLocation();
  const path = location.pathname;

  // Paths that can be accessed without authentication
  const publicPaths = [
    '/',
    '/home',
    '/courses',
    '/course/details'
  ];

  // Check if current path is public (allowing for dynamic IDs in course details)
  const isPublicPath = () => {
    return publicPaths.some(publicPath => 
      path === publicPath || 
      (publicPath === '/course/details' && path.startsWith('/course/details/'))
    );
  };

  // Allow access to public paths without authentication
  if (!authenticated && !path.includes("/auth")) {
    // Allow access to home, courses listing, and course details without auth
    if (isPublicPath()) {
      return <Fragment>{element}</Fragment>;
    }
    // Redirect to auth for protected pages
    return <Navigate to="/auth" />;
  }

  // If authenticated but trying to access auth page, redirect based on role
  if (authenticated && path.includes("/auth")) {
    return user?.role === "instructor" 
      ? <Navigate to="/instructor" /> 
      : <Navigate to="/home" />;
  }

  // Instructor role restrictions
  if (
    authenticated &&
    user?.role !== "instructor" &&
    path.includes("instructor")
  ) {
    return <Navigate to="/home" />;
  }

  // Force instructors to their dashboard
  if (
    authenticated &&
    user?.role === "instructor" &&
    !path.includes("instructor")
  ) {
    return <Navigate to="/instructor" />;
  }

  return <Fragment>{element}</Fragment>;
}

export default RouteGuard;
