import React from "react";
import { useAuth } from "../context/AuthContext";

function ProfileCorner() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const displayName = user.name?.trim() || "there";

  return (
    <div className="fixed top-6 right-6 z-[60]">
      <div className="flex items-center gap-3">
        <div className="text-sm font-semibold text-stone-50 max-w-[180px] truncate whitespace-nowrap">
          <span className="text-stone-400 mr-1">Hi,</span>
          <span>{displayName}</span>
        </div>
        {user.avatarUrl ? (
          <img
            className="h-9 w-9 rounded-full object-cover shadow-[0_0_18px_rgba(197,253,93,0.24)]"
            alt={displayName}
            referrerPolicy="no-referrer"
            src={user.avatarUrl}
          />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-on-primary-container text-sm font-bold shadow-[0_0_18px_rgba(197,253,93,0.24)]">
            <span
              className="material-symbols-outlined text-[18px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              account_circle
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileCorner;
