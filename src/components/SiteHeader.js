import React from "react";
import AppNavLink from "./AppNavLink";
import Logo from "./Logo";
import RouteButton from "./RouteButton";

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
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between gap-8 bg-stone-950/40 backdrop-blur-xl rounded-full mt-6 mx-auto w-fit pl-6 pr-[10px] py-2.5 border border-white/10 font-['Product_Sans'] tracking-tight text-sm font-medium shadow-[0_0_40px_-15px_rgba(197,253,93,0.15)] ${headerClassName}`.trim()}
    >
      <Logo className={logoClassName} />
      <nav className={`hidden md:flex items-center gap-6 ${navClassName}`.trim()}>
        {navItems.map((item) => (
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
      <RouteButton to={ctaTo} className={ctaClassName}>
        {ctaLabel}
      </RouteButton>
    </header>
  );
}

export default SiteHeader;
