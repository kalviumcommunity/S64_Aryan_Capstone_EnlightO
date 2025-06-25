import { GraduationCap, TvMinimalPlay, LogIn, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useContext, useState, useEffect, useCallback } from "react";
import { AuthContext } from "@/context/auth-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function StudentViewCommonHeader() {
  const navigate = useNavigate();
  const { auth, resetCredentials } = useContext(AuthContext);
  // Add render counter to force component updates
  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);
  
  // Local state to track authentication
  const [isAuthenticated, setIsAuthenticated] = useState(auth?.authenticate);
  
  // State to control the logout confirmation dialog
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  
  // Update local state when auth changes
  useEffect(() => {
    setIsAuthenticated(auth?.authenticate);
  }, [auth?.authenticate]);

  function handleLogoutClick() {
    // Show confirmation dialog instead of logging out immediately
    setShowLogoutConfirmation(true);
  }
  
  function handleConfirmLogout() {
    resetCredentials();
    // Immediately update local state
    setIsAuthenticated(false);
    // Force a re-render
    forceUpdate();
    // Close the dialog
    setShowLogoutConfirmation(false);
  }
  
  function handleCancelLogout() {
    setShowLogoutConfirmation(false);
  }

  function handleAuth() {
    navigate("/auth");
  }

  return (
    <>
      <header className="flex items-center justify-between p-4 border-b relative" style={{ backgroundColor: '#1F1D36' }}>
        <div className="flex items-center space-x-4">
          <Link to="/home" className="flex items-center hover:text-black">
            <GraduationCap className="h-8 w-8 mr-4 text-white" />
            <span className="font-extrabold md:text-2xl text-lg text-white">
              EnlightO
            </span>
          </Link>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              onClick={() => {
                location.pathname.includes("/courses")
                  ? null
                  : navigate("/courses");
              }}
              className="text-[14px] md:text-[16px] font-medium text-white"
            >
              Explore Courses
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="flex gap-12 items-center">
              <div
                onClick={() => navigate("/student-courses")}
                className="flex cursor-pointer items-center gap-3 group"
              >
                <span className="font-medium md:text-xl text-[14px] text-white group-hover:text-black group-hover:bg-white group-hover:rounded-md group-hover:px-3 group-hover:py-1 transition-all">
                  My Courses
                </span>
                <TvMinimalPlay className="w-8 h-8 cursor-pointer text-white group-hover:text-black group-hover:bg-white group-hover:rounded-md group-hover:p-1 transition-all" />
              </div>
              <Button onClick={handleLogoutClick} className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex gap-4 items-center">
              <Button onClick={handleAuth} className="flex items-center gap-2 bg-[#FF7043] text-white hover:bg-[#ff5722]">
                <LogIn className="h-4 w-4" />
                Sign In
              </Button>
            </div>
          )}
        </div>
      </header>
      
      {/* Logout Confirmation Dialog */}
      <Dialog open={showLogoutConfirmation} onOpenChange={setShowLogoutConfirmation}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sign Out Confirmation</DialogTitle>
            <DialogDescription>
              Are you sure you want to sign out? You will need to sign in again to access your courses.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-between sm:justify-between mt-4">
            <Button variant="outline" onClick={handleCancelLogout}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmLogout} className="gap-2">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default StudentViewCommonHeader;
