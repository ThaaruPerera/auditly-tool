import React from "react";
import { useNavigate } from "react-router-dom";
import AppNavLink from "./AppNavLink";
import Logo from "./Logo";
import RouteButton from "./RouteButton";
import { useAuth } from "../context/AuthContext";

function SiteHeader({
  navItems,
  ctaLabel,
  ctaTo,
  logoClassName = "w-[92px] text-stone-50 flex-shrink-0",
  headerClassName = "",
  navClassName = "",
  navItemClassName = "",
  navItemActiveClassName = "",
  ctaClassName = ""
}) {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const resolvedNavItems = navItems || [
    { label: "Home", to: "/" },
    { label: "Dashboard", to: "/dashboard" },
    { label: "History", to: "/history" }
  ];

  const handleLogout = async () => {
    if (isAuthenticated) {
      await logout();
      navigate("/");
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between gap-8 bg-stone-950/40 backdrop-blur-xl rounded-full mt-6 mx-auto w-fit pl-6 pr-[10px] py-2.5 border border-white/10 font-['Product_Sans'] tracking-tight text-sm font-medium shadow-[0_0_40px_-15px_rgba(197,253,93,0.15)] ${headerClassName}`.trim()}
    >
      <Logo className={logoClassName} />
      <nav className={`hidden md:flex items-center gap-6 ${navClassName}`.trim()}>
        {resolvedNavItems.map((item) => (
          <AppNavLink
            key={item.to}
            to={item.to}
            className={navItemClassName}
            activeClassName={navItemActiveClassName}
          >
            {item.label}
          </AppNavLink>
        ))}
      </nav>
      {isAuthenticated ? (
        <button
          type="button"
          className={ctaClassName}
          onClick={handleLogout}
        >
          Logout
        </button>
      ) : (
        <RouteButton
          to={ctaTo || "/analysis"}
          className={ctaClassName}
        >
          Get Started
        </RouteButton>
      )}
    </header>
  );
}

export default SiteHeader;
