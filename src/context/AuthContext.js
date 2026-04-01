import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

const AuthContext = createContext(null);

function deriveNameFromEmail(email) {
  const localPart = (email || "").split("@")[0].replace(/[._-]+/g, " ").trim();

  if (!localPart) {
    return "there";
  }

  return localPart
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function normalizeUser(user) {
  if (!user || typeof user !== "object") {
    return null;
  }

  const id = (user.id || "").trim();
  const email = (user.email || "").trim().toLowerCase();
  const name = (user.name || "").trim() || deriveNameFromEmail(email);
  const avatarUrl = (user.avatarUrl || "").trim();

  if (!id || !email) {
    return null;
  }

  return { avatarUrl, id, name, email };
}

function mapSupabaseUser(sessionUser) {
  if (!sessionUser) {
    return null;
  }

  return normalizeUser({
    id: sessionUser.id,
    email: sessionUser.email,
    name:
      sessionUser.user_metadata?.full_name ||
      sessionUser.user_metadata?.name ||
      deriveNameFromEmail(sessionUser.email),
    avatarUrl:
      sessionUser.user_metadata?.avatar_url ||
      sessionUser.user_metadata?.picture ||
      ""
  });
}

function AuthProvider({ children }) {
  const [user, setUserState] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    if (!isSupabaseConfigured || !supabase) {
      setAuthLoading(false);
      return undefined;
    }

    supabase.auth.getSession().then(({ data, error }) => {
      if (!isMounted) {
        return;
      }

      if (error) {
        console.error("Unable to restore Supabase session.", error);
        setUserState(null);
      } else {
        setUserState(mapSupabaseUser(data.session?.user || null));
      }

      setAuthLoading(false);
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) {
        return;
      }

      setUserState(mapSupabaseUser(session?.user || null));
      setAuthLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const setUser = (nextUser) => {
    setUserState(normalizeUser(nextUser));
  };

  const signUp = async ({ email, name, password }) => {
    const normalizedEmail = (email || "").trim().toLowerCase();
    const normalizedName = (name || "").trim();
    const normalizedPassword = (password || "").trim();

    if (!normalizedEmail || !normalizedName || !normalizedPassword) {
      return { ok: false, error: "Please complete all signup fields." };
    }

    if (normalizedPassword.length < 6) {
      return { ok: false, error: "Password must be at least 6 characters." };
    }

    if (!isSupabaseConfigured || !supabase) {
      return {
        ok: false,
        error: "Supabase is not configured yet. Add REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY."
      };
    }

    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password: normalizedPassword,
      options: {
        data: {
          full_name: normalizedName
        }
      }
    });

    if (error) {
      return { ok: false, error: error.message };
    }

    if (data.session?.user) {
      setUserState(mapSupabaseUser(data.session.user));
    }

    return { ok: true };
  };

  const login = async ({ email, password }) => {
    const normalizedEmail = (email || "").trim().toLowerCase();
    const normalizedPassword = (password || "").trim();

    if (!normalizedEmail || !normalizedPassword) {
      return { ok: false, error: "Please enter both email and password." };
    }

    if (!isSupabaseConfigured || !supabase) {
      return {
        ok: false,
        error: "Supabase is not configured yet. Add REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY."
      };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password: normalizedPassword
    });

    if (error) {
      return { ok: false, error: error.message };
    }

    setUserState(mapSupabaseUser(data.user));

    return { ok: true };
  };

  const signInWithGoogle = async (redirectPath = "/dashboard") => {
    if (!isSupabaseConfigured || !supabase) {
      return {
        ok: false,
        error: "Supabase is not configured yet. Add REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY."
      };
    }

    const redirectTo = new URL(redirectPath, window.location.origin).toString();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo
      }
    });

    if (error) {
      return { ok: false, error: error.message };
    }

    return { ok: true };
  };

  const logout = async () => {
    if (supabase) {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return { ok: false, error: error.message };
      }
    }

    setUserState(null);
    return { ok: true };
  };

  const value = useMemo(
    () => ({
      user,
      accounts: [],
      authLoading,
      isAuthenticated: Boolean(user),
      setUser,
      signUp,
      login,
      signInWithGoogle,
      logout
    }),
    [authLoading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}

export { AuthProvider, useAuth, deriveNameFromEmail };
