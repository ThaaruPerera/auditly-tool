import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);
const USER_STORAGE_KEY = "auditlyUser";
const ACCOUNT_STORAGE_KEY = "auditlyAccounts";

function safeReadJson(key, fallbackValue) {
  try {
    const rawValue = localStorage.getItem(key);

    if (!rawValue) {
      return fallbackValue;
    }

    return JSON.parse(rawValue);
  } catch (error) {
    return fallbackValue;
  }
}

function safeWriteJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

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

  const email = (user.email || "").trim().toLowerCase();
  const name = (user.name || "").trim() || deriveNameFromEmail(email);

  if (!email) {
    return null;
  }

  return { name, email };
}

function normalizeAccount(account) {
  if (!account || typeof account !== "object") {
    return null;
  }

  const normalizedUser = normalizeUser(account);
  const password = (account.password || "").trim();

  if (!normalizedUser || !password) {
    return null;
  }

  return { ...normalizedUser, password };
}

function readStoredUser() {
  return normalizeUser(safeReadJson(USER_STORAGE_KEY, null));
}

function readStoredAccounts() {
  const rawAccounts = safeReadJson(ACCOUNT_STORAGE_KEY, []);

  if (!Array.isArray(rawAccounts)) {
    return [];
  }

  return rawAccounts.map(normalizeAccount).filter(Boolean);
}

function AuthProvider({ children }) {
  const [user, setUserState] = useState(null);
  const [accounts, setAccountsState] = useState([]);

  useEffect(() => {
    setUserState(readStoredUser());
    setAccountsState(readStoredAccounts());
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      setUserState(readStoredUser());
      setAccountsState(readStoredAccounts());
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const setUser = (nextUser) => {
    const normalizedUser = normalizeUser(nextUser);

    if (!normalizedUser) {
      localStorage.removeItem(USER_STORAGE_KEY);
      setUserState(null);
      return;
    }

    safeWriteJson(USER_STORAGE_KEY, normalizedUser);
    setUserState(normalizedUser);
  };

  const signUp = ({ email, name, password }) => {
    const normalizedAccount = normalizeAccount({ email, name, password });

    if (!normalizedAccount) {
      return { ok: false, error: "Please complete all signup fields." };
    }

    if (normalizedAccount.password.length < 6) {
      return { ok: false, error: "Password must be at least 6 characters." };
    }

    const existingAccount = accounts.find(
      (account) => account.email === normalizedAccount.email
    );

    if (existingAccount) {
      return { ok: false, error: "An account already exists for this email." };
    }

    const nextAccounts = [...accounts, normalizedAccount];

    safeWriteJson(ACCOUNT_STORAGE_KEY, nextAccounts);
    safeWriteJson(USER_STORAGE_KEY, {
      email: normalizedAccount.email,
      name: normalizedAccount.name
    });

    setAccountsState(nextAccounts);
    setUserState({ email: normalizedAccount.email, name: normalizedAccount.name });

    return { ok: true };
  };

  const login = ({ email, password }) => {
    const normalizedEmail = (email || "").trim().toLowerCase();
    const normalizedPassword = (password || "").trim();

    if (!normalizedEmail || !normalizedPassword) {
      return { ok: false, error: "Please enter both email and password." };
    }

    const matchedAccount = accounts.find((account) => account.email === normalizedEmail);

    if (!matchedAccount) {
      return { ok: false, error: "No account found for this email." };
    }

    if (matchedAccount.password !== normalizedPassword) {
      return { ok: false, error: "Incorrect password." };
    }

    safeWriteJson(USER_STORAGE_KEY, {
      email: matchedAccount.email,
      name: matchedAccount.name
    });

    setUserState({ email: matchedAccount.email, name: matchedAccount.name });

    return { ok: true };
  };

  const logout = () => {
    localStorage.removeItem(USER_STORAGE_KEY);
    setUserState(null);
  };

  const value = useMemo(
    () => ({
      user,
      accounts,
      isAuthenticated: Boolean(user),
      setUser,
      signUp,
      login,
      logout
    }),
    [accounts, user]
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
