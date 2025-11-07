"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

// ===== Cookie helpers (SESSION cookies: no expires attribute) =====
const setSessionCookie = (name, value) => {
  // Secure attributes (adjust SameSite if you embed cross-site)
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; SameSite=Lax`;
};

const getCookie = (name) => {
  const nameEQ = `${name}=`;
  const parts = document.cookie?.split(";") || [];
  for (let c of parts) {
    c = c.trim();
    if (c.startsWith(nameEQ)) return decodeURIComponent(c.slice(nameEQ.length));
  }
  return null;
};

const deleteCookie = (name) => {
  // Delete immediately
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
};

// ===== Roles =====
export const ROLES = {
  SUPER_ADMIN: "super-admin",
  ADMIN: "admin",
  SCHOOL: "school",
  STUDENT: "student",
};

// ===== Tab counting keys =====
const TAB_COUNT_KEY = "auth_tab_count";
const FORCE_LOGOUT_KEY = "auth_force_logout_broadcast";

// Util: safe localStorage get/set
const lsGetInt = (key) => {
  try {
    const v = parseInt(localStorage.getItem(key) || "0", 10);
    return Number.isFinite(v) ? v : 0;
  } catch {
    return 0;
  }
};
const lsSet = (key, val) => {
  try {
    localStorage.setItem(key, String(val));
  } catch {}
};

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const tabRegisteredRef = useRef(false); // ensure we only increment once per tab lifecycle

  // ---------- Bootstrap auth state from SESSION cookies ----------
  useEffect(() => {
    const token = getCookie("token");
    const userJson = getCookie("user");

    if (token && userJson) {
      try {
        const parsed = JSON.parse(userJson);
        setUser(parsed);
        // Mirror minimal per-tab context (optional)
        sessionStorage.setItem("user", userJson);
        sessionStorage.setItem("hasAuth", "1");

        // Register this tab exactly once
        if (!tabRegisteredRef.current) {
          const current = lsGetInt(TAB_COUNT_KEY);
          lsSet(TAB_COUNT_KEY, current + 1);
          tabRegisteredRef.current = true;
        }
      } catch {
        // Bad cookie → clear
        deleteCookie("token");
        deleteCookie("user");
        setUser(null);
      }
    } else {
      // No cookies → unauthenticated
      setUser(null);
    }

    setLoading(false);
  }, []);

  // ---------- Multi-tab events ----------
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === FORCE_LOGOUT_KEY && e.newValue) {
        // another tab declared "everyone logout now"
        performLocalLogout(false); // don't push twice here; router push is handled below
        router.push("/auth/sign-in");
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- Handle tab close/unload to zero-out session when last tab closes ----------
  useEffect(() => {
    const handleTabRemoval = () => {
      if (!tabRegisteredRef.current) return;

      // Decrement count
      const current = lsGetInt(TAB_COUNT_KEY);
      const next = Math.max(0, current - 1);
      lsSet(TAB_COUNT_KEY, next);

      // If this was the last authenticated tab, wipe session cookies
      if (next === 0) {
        // Clear cookies and broadcast a final "force logout"
        deleteCookie("token");
        deleteCookie("user");
        try {
          // Trigger other potential listeners (rare, since we're last tab)
          localStorage.setItem(FORCE_LOGOUT_KEY, String(Date.now()));
        } catch {}
      }
      tabRegisteredRef.current = false;
    };

    // pagehide (fires on tab close, history nav, etc.) is more reliable than beforeunload
    window.addEventListener("pagehide", handleTabRemoval);
    window.addEventListener("beforeunload", handleTabRemoval);
    return () => {
      window.removeEventListener("pagehide", handleTabRemoval);
      window.removeEventListener("beforeunload", handleTabRemoval);
    };
  }, []);

  // ---------- Auth helpers ----------
  const performLocalLogin = (userObj, token) => {
    // Set SESSION cookies (shared across tabs, cleared when browser closes or when last tab decrements to 0)
    setSessionCookie("token", token);
    setSessionCookie("user", JSON.stringify(userObj));

    // Optional per-tab mirrors (not used by middleware)
    sessionStorage.setItem("user", JSON.stringify(userObj));
    sessionStorage.setItem("hasAuth", "1");

    setUser(userObj);

    // Register this tab if not yet
    if (!tabRegisteredRef.current) {
      const current = lsGetInt(TAB_COUNT_KEY);
      lsSet(TAB_COUNT_KEY, current + 1);
      tabRegisteredRef.current = true;
    }
  };

  const performLocalLogout = (broadcast = true) => {
    // Clear per-tab mirrors
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("hasAuth");

    // Clear session cookies
    deleteCookie("token");
    deleteCookie("user");
    setUser(null);

    // Decrement tab count if this tab was registered
    if (tabRegisteredRef.current) {
      const current = lsGetInt(TAB_COUNT_KEY);
      const next = Math.max(0, current - 1);
      lsSet(TAB_COUNT_KEY, next);
      tabRegisteredRef.current = false;
    }

    // Optionally tell other tabs to logout
    if (broadcast) {
      try {
        localStorage.setItem(FORCE_LOGOUT_KEY, String(Date.now()));
      } catch {}
    }
  };

  const login = async (email, password) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();
      if (!data?.status) {
        return { success: false, message: data?.message || "Login failed" };
      }

      const userData = data.data.user;
      const token = data.data.token;

      performLocalLogin(userData, token);

      // Role redirect
      if (
        userData.role === ROLES.ADMIN ||
        userData.role === ROLES.SUPER_ADMIN ||
        userData.role === ROLES.SCHOOL
      ) {
        router.push("/admin/dashboard");
      } else if (userData.role === ROLES.STUDENT) {
        router.push("/student/dashboard");
      } else {
        throw new Error("Invalid user role");
      }

      return { success: true, message: data.message || "Logged in" };
    } catch (err) {
      return {
        success: false,
        message: err?.message || "An error occurred. Please try again.",
      };
    }
  };

  const logout = async () => {
    // Grab token from cookie once (before we delete)
    const token = getCookie("token");

    // Locally clear immediately
    performLocalLogout(true);

    // Navigate away immediately
    router.push("/auth/sign-in");

    // Try calling API (best-effort)
    if (token) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          keepalive: true, // allow to complete on page unload
        });
      } catch {
        // ignore
      }
    }
  };

  const getToken = () => getCookie("token");
  const getUserRole = () => user?.role || null;
  const isAuthenticated = () => !!getToken();

  const value = {
    user,
    loading,
    login,
    logout,
    getToken,
    getUserRole,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}








// "use client";

// import { createContext, useContext, useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';

// const AuthContext = createContext();

// // DEFINE ROLE CONSTANTS
// export const ROLES = {
//   SUPER_ADMIN: 'super-admin',
//   ADMIN: 'admin',
//   SCHOOL: 'school',
//   STUDENT: 'student'
// };

// export function AuthProvider({ children }) {
//   const router = useRouter();
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // CHECK FOR EXISTING USER SESSION ON MOUNT 
//     const storedUser = sessionStorage.getItem('user');
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//     setLoading(false);
//   }, []);

//   const login = async (email, password, rememberMe) => {
//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await response.json();

//       if (data.status) {
//         // STORE TOKENS
//         sessionStorage.setItem('token', data.data.token);
//         if (rememberMe) {
//           localStorage.setItem('token', data.data.token);
//         }

//         // STORE USER DATA
//         const userData = data.data.user;
//         console.log('Login Response:', data);
//         console.log('User Data:', userData);
//         console.log('School ID from login:', userData.school_id);

//         // ENSURE school_id IS SET CORRECTLY
//         if (!userData.school_id) {
//           console.error('Warning: No school_id in user data');
//         }

//         sessionStorage.setItem('user', JSON.stringify(userData));
//         console.log('Stored user data:', JSON.parse(sessionStorage.getItem('user')));
//         setUser(userData);

//         // HANDLE REDIRECTION BASED ON ROLE
//         switch (userData.role) {
//           case ROLES.ADMIN:
//           case ROLES.SUPER_ADMIN:
//           case ROLES.SCHOOL:
//             router.push('/admin/dashboard');
//             break;
//           case ROLES.STUDENT:
//             router.push('/student/dashboard');
//             break;
//           default:
//             throw new Error('Invalid user role');
//         }

//         return { success: true, message: data.message };
//       } else {
//         return { success: false, message: data.message };
//       }
//     } catch (error) {
//       return {
//         success: false,
//         message: error.message || 'An error occurred. Please try again.'
//       };
//     }
//   };

//   const logout = async () => {
//     try {
//       // FIRST CLEAR ALL STORED DATA IMMEDIATELY
//       sessionStorage.removeItem('token');
//       sessionStorage.removeItem('user');
//       localStorage.removeItem('token');
//       setUser(null);

//       // REDIRECT TO SIGN-IN PAGE IMMEDIATELY
//       router.push('/auth/sign-in');

//       // THEN MAKE THE API CALL IN THE BACKGROUND
//       const token = getToken();
//       if (token) {
//         await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout`, {
//           method: 'POST',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         });
//       }
//     } catch (error) {
//       console.error('Logout error:', error);
//     } finally {
//       // ENSURE USER IS LOGGED OUT EVEN IF API CALL FAILS
//       sessionStorage.removeItem('token');
//       sessionStorage.removeItem('user');
//       localStorage.removeItem('token');
//       setUser(null);
//       router.push('/auth/sign-in');
//     }
//   };

//   const getToken = () => {
//     // TRY SESSION STORAGE FIRST, THEN LOCAL STORAGE
//     return sessionStorage.getItem('token') || localStorage.getItem('token');
//   };

//   const getUserRole = () => {
//     return user?.role;
//   };

//   const isAuthenticated = () => {
//     return !!getToken();
//   };

//   const value = {
//     user,
//     loading,
//     login,
//     logout,
//     getToken,
//     getUserRole,
//     isAuthenticated
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// }