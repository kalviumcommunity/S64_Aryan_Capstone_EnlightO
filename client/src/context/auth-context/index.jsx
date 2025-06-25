import { Skeleton } from "@/components/ui/skeleton";
import { initialSignInFormData, initialSignUpFormData } from "@/config";
import { checkAuthService, loginService, registerService } from "@/services";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
  const [auth, setAuth] = useState(() => {
    // Initialize auth state from localStorage
    const savedAuth = localStorage.getItem("auth");
    return savedAuth ? JSON.parse(savedAuth) : {
      authenticate: false,
      user: null,
    };
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Save auth state to localStorage whenever it changes
  useEffect(() => {
    if (auth.authenticate) {
      localStorage.setItem("auth", JSON.stringify(auth));
    }
  }, [auth]);

  async function handleRegisterUser(event, redirectPath = '/') {
    event.preventDefault();
    try {
      setError("");
      const data = await registerService(signUpFormData);
      if (data.success) {
        // Set authentication state after successful registration
        localStorage.setItem("accessToken", data.data.accessToken);
        const authData = {
          authenticate: true,
          user: data.data.user,
        };
        setAuth(authData);
        localStorage.setItem("auth", JSON.stringify(authData));
        
        // Reset form data after successful registration
        setSignUpFormData(initialSignUpFormData);
        
        // Use the passed redirectPath instead of hardcoding to homepage
        if (redirectPath !== '/auth') {
          window.location.href = redirectPath;
        } else {
          window.location.href = '/';
        }
        
        console.log("Registration successful! Redirecting...");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
      setError(errorMessage);
      console.error("Registration error:", errorMessage);
    }
  }

  async function handleLoginUser(event, redirectPath = '/') {
    event.preventDefault();
    try {
      setError("");
      const data = await loginService(signInFormData);

      if (data.success) {
        localStorage.setItem("accessToken", data.data.accessToken);
        const authData = {
          authenticate: true,
          user: data.data.user,
        };
        setAuth(authData);
        localStorage.setItem("auth", JSON.stringify(authData));
        
        // Redirect to the specified path after successful login
        if (redirectPath !== '/auth') {
          window.location.href = redirectPath;
        } else {
          window.location.href = '/';
        }
      } else {
        setAuth({
          authenticate: false,
          user: null,
        });
        setError(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error.response?.data?.message || "Login failed. Please try again.");
      setAuth({
        authenticate: false,
        user: null,
      });
    }
  }

  async function checkAuthUser() {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setAuth({
          authenticate: false,
          user: null,
        });
        setLoading(false);
        return;
      }

      const data = await checkAuthService();
      if (data.success) {
        setAuth({
          authenticate: true,
          user: data.data.user,
        });
      } else {
        // Clear invalid auth state
        localStorage.removeItem("accessToken");
        localStorage.removeItem("auth");
        setAuth({
          authenticate: false,
          user: null,
        });
      }
    } catch (error) {
      console.error("Auth check error:", error);
      // Clear invalid auth state
      localStorage.removeItem("accessToken");
      localStorage.removeItem("auth");
      setAuth({
        authenticate: false,
        user: null,
      });
    } finally {
      setLoading(false);
    }
  }

  function resetCredentials() {
    // Clear auth data from localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("auth");
    
    // Update auth state
    const unauthState = {
      authenticate: false,
      user: null,
    };
    
    // Set the new state
    setAuth(unauthState);
    
    // Force update of localStorage to ensure immediate sync
    localStorage.setItem("forceRerender", Date.now().toString());
    
    // Optional: Force a page reload if needed
    // window.location.reload();
  }

  useEffect(() => {
    checkAuthUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signInFormData,
        setSignInFormData,
        signUpFormData,
        setSignUpFormData,
        handleRegisterUser,
        handleLoginUser,
        auth,
        resetCredentials,
        error,
      }}
    >
      {loading ? <Skeleton /> : children}
    </AuthContext.Provider>
  );
}
