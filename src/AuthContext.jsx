import { createContext, useState, useContext, useEffect } from "react";
import supabase from "./supabase-client";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  // Session state (user info, sign-in status)
  const [session, setSession] = useState(undefined);
  const [users, setUsers] = useState([]);
  // 1) check o 1st render for a session(getSession())
  async function getInitialSession() {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        throw error;
      }
      console.log(data.session);
      setSession(data.session);
    } catch (error) {
      console.error("Error getting session", error);
    }
  }

  async function fetchUsers() {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("id, name, account_type");

      if (error) {
        throw error;
      }
      console.log("Fetched users: ", data);
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error.message);
    }
  }

  useEffect(() => {
    getInitialSession();

    // 2) Listen for change in auth state (.onAuthchange)
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      console.log("Session changed:", session);
    });
  }, []);

  useEffect(() => {
    if (!session) {
      return;
    }
    fetchUsers();
  }, [session]);

  // Auth functions (signin, signup, logout)
  const signInUser = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password: password,
      });

      if (error) {
        console.error("Supabase sign-in error:", error.message);
        return { success: false, error: error.message };
      }
      console.log("Supabase sign-in success:", data);
      return { success: true, data };
    } catch (error) {
      console.error("Unexprected error during sign-un: ", error.message);
      return {
        success: false,
        error: "An unexpected error occurred. Please try again!",
      };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Supabase sign-out error:", error.message);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error("Unexprected error during sign-out: ", error.message);
      return {
        success: false,
        error: "An unexpected error occurred. During sign out",
      };
    }
  };

  // signup
  const signUpNewUser = async (email, password, name, accountType) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase(),
        password: password,
        options: {
          data: {
            name,
            account_type: accountType,
          },
        },
      });

      if (error) {
        console.error("Supabase sign-up error:", error.message);
        return { success: false, error: error.message };
      }
      console.log("Supabase sign-up success:", data);
      return { success: true, data };
    } catch (error) {
      console.error("Unexprected error during sign-up: ", error.message);
      return {
        success: false,
        error: "An unexpected error occurred. Please try again!",
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{ session, signInUser, signOut, signUpNewUser, users }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
