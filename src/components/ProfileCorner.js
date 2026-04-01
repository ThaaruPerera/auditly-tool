import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProfileCorner() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!user) {
    return null;
  }

  const displayName = user.name?.trim() || "there";

  const handleLogout = () => {
    setUser(null);
    setIsMenuOpen(false);
    navigate("/login");
  };

  return (
    <div className="fixed top-6 right-6 z-[60]">
      <div className="flex items-center gap-3">
        <div className="text-sm font-semibold text-stone-50 max-w-[180px] truncate whitespace-nowrap">
          <span className="text-stone-400 mr-1">Hi,</span>
          <span>{displayName}</span>
        </div>
        <div
          className="relative"
          onMouseEnter={() => {
            setIsMenuOpen(true);
          }}
          onMouseLeave={() => {
            setIsMenuOpen(false);
          }}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-on-primary-container text-sm font-bold shadow-[0_0_18px_rgba(197,253,93,0.24)]">
            <span
              className="material-symbols-outlined text-[18px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              account_circle
            </span>
          </div>
          {isMenuOpen ? (
            <div className="absolute right-0 top-full pt-3">
              <button
                type="button"
                className="rounded-xl border border-white/10 bg-stone-950/90 px-4 py-2 text-sm font-medium text-stone-50 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.35)] hover:text-primary transition-colors"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default ProfileCorner;
