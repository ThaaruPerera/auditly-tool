import React from "react";
import Logo from "./Logo";
import AppNavLink from "./AppNavLink";

function AppFooter({ className = "", borderClassName = "border-white/5", textClassName = "text-stone-500", linkHoverClassName = "hover:text-lime-400" }) {
  const linkClassName = `font-['Product_Sans'] text-xs uppercase tracking-widest ${textClassName} ${linkHoverClassName} transition-colors opacity-80 hover:opacity-100`;

  return (
    <footer className={`w-full py-12 border-t ${borderClassName} ${className}`.trim()}>
      <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <Logo className="w-[96px] text-stone-50 flex-shrink-0" />
        <div className="flex flex-wrap justify-center gap-8">
          <AppNavLink to="/" className={linkClassName}>Home</AppNavLink>
          <AppNavLink to="/dashboard" className={linkClassName}>Dashboard</AppNavLink>
          <AppNavLink to="/history" className={linkClassName}>History</AppNavLink>
          <AppNavLink to="/signup" className={linkClassName}>Signup</AppNavLink>
        </div>
        <p className={`font-['Product_Sans'] text-xs uppercase tracking-widest ${textClassName}`}>
          © 2026 Auditly. The Digital Aurora Experience.
        </p>
      </div>
    </footer>
  );
}

export default AppFooter;
