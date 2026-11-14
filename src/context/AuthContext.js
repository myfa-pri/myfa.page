"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile
} from "firebase/auth";
import {
  auth,
  googleProvider,
  githubProvider,
  isFirebaseConfigured,
  getSubdomainRecord,
  claimOrUpdateSubdomain,
  INITIAL_DEMO_SUBDOMAINS
} from "@/lib/firebase";

const AuthContext = createContext(null);

const DEFAULT_DEMO_USER = {
  uid: "demo-user-alex",
  email: "alex.rivera@myfa.page",
  displayName: "Alex Rivera",
  subdomain: "cyberpulse",
  publicationName: "CyberPulse Dispatch",
  category: "Tech & AI",
  isDemo: true
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(DEFAULT_DEMO_USER);
  const [activeSubdomain, setActiveSubdomain] = useState("cyberpulse");
  const [subdomainRecord, setSubdomainRecord] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUser = window.localStorage.getItem("myfapost_active_user_v3");
      const savedSub = window.localStorage.getItem("myfapost_active_subdomain_v3");
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          setUser(parsed);
        } catch (e) {}
      }
      if (savedSub) {
        setActiveSubdomain(savedSub);
      }
    }

    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        if (fbUser) {
          const mapped = {
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName || fbUser.email?.split("@")[0] || "Creator",
            subdomain: activeSubdomain || "cyberpulse",
            isDemo: false
          };
          setUser(mapped);
          if (typeof window !== "undefined") {
            window.localStorage.setItem("myfapost_active_user_v3", JSON.stringify(mapped));
          }
        }
      });
      return () => unsubscribe();
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    getSubdomainRecord(activeSubdomain).then((rec) => {
      if (mounted && rec) setSubdomainRecord(rec);
    });
    return () => {
      mounted = false;
    };
  }, [activeSubdomain]);

  const switchActiveSubdomain = async (newSub) => {
    const clean = String(newSub || "cyberpulse").toLowerCase().trim();
    setActiveSubdomain(clean);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("myfapost_active_subdomain_v3", clean);
    }
    const rec = await getSubdomainRecord(clean);
    setSubdomainRecord(rec);
  };

  const registerWithSubdomain = async ({
    email,
    password,
    displayName,
    subdomain,
    publicationName,
    category
  }) => {
    setLoading(true);
    try {
      let uid = `user-${Date.now()}`;
      if (isFirebaseConfigured && auth) {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        if (displayName) {
          await updateProfile(cred.user, { displayName });
        }
        uid = cred.user.uid;
      }

      const claimed = await claimOrUpdateSubdomain({
        subdomain,
        displayName: publicationName || `${displayName}'s Dispatch`,
        authorName: displayName || email.split("@")[0],
        category: category || "Tech & AI",
        userId: uid
      });

      const nextUser = {
        uid,
        email,
        displayName: displayName || email.split("@")[0],
        subdomain: claimed.subdomain,
        publicationName: claimed.displayName,
        category: claimed.category,
        isDemo: !isFirebaseConfigured
      };

      setUser(nextUser);
      setActiveSubdomain(claimed.subdomain);
      setSubdomainRecord(claimed);
      if (typeof window !== "undefined") {
        window.localStorage.setItem("myfapost_active_user_v3", JSON.stringify(nextUser));
        window.localStorage.setItem("myfapost_active_subdomain_v3", claimed.subdomain);
      }
      return nextUser;
    } finally {
      setLoading(false);
    }
  };

  const loginWithEmail = async ({ email, password }) => {
    setLoading(true);
    try {
      if (isFirebaseConfigured && auth) {
        const cred = await signInWithPopup ? await signInWithEmailAndPassword(auth, email, password) : null;
        if (cred && cred.user) {
          const nextUser = {
            uid: cred.user.uid,
            email: cred.user.email,
            displayName: cred.user.displayName || email.split("@")[0],
            subdomain: activeSubdomain,
            isDemo: false
          };
          setUser(nextUser);
          if (typeof window !== "undefined") {
            window.localStorage.setItem("myfapost_active_user_v3", JSON.stringify(nextUser));
          }
          return nextUser;
        }
      }
      const nextUser = {
        uid: "demo-user-alex",
        email,
        displayName: email.split("@")[0],
        subdomain: activeSubdomain || "cyberpulse",
        publicationName: "CyberPulse Dispatch",
        isDemo: true
      };
      setUser(nextUser);
      if (typeof window !== "undefined") {
        window.localStorage.setItem("myfapost_active_user_v3", JSON.stringify(nextUser));
      }
      return nextUser;
    } finally {
      setLoading(false);
    }
  };

  const loginWithOAuth = async (providerName) => {
    if (isFirebaseConfigured && auth) {
      const provider = providerName === "github" ? githubProvider : googleProvider;
      const cred = await signInWithPopup(auth, provider);
      const nextUser = {
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: cred.user.displayName || "Creator",
        subdomain: activeSubdomain,
        isDemo: false
      };
      setUser(nextUser);
      return nextUser;
    }
    const simulated = {
      uid: `oauth-${providerName}-${Date.now()}`,
      email: `creator@${providerName}.com`,
      displayName: providerName === "github" ? "GitHub Systems Creator" : "Google Cloud Creator",
      subdomain: activeSubdomain || "cyberpulse",
      publicationName: "CyberPulse Dispatch",
      isDemo: true
    };
    setUser(simulated);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("myfapost_active_user_v3", JSON.stringify(simulated));
    }
    return simulated;
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      try {
        await firebaseSignOut(auth);
      } catch (e) {}
    }
    setUser(DEFAULT_DEMO_USER);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        activeSubdomain,
        subdomainRecord,
        loading,
        isFirebaseConfigured,
        switchActiveSubdomain,
        registerWithSubdomain,
        loginWithEmail,
        loginWithOAuth,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
