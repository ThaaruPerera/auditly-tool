import React from "react";
import { NavLink } from "react-router-dom";

function AppNavLink({ to, className, activeClassName = "", children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive ? `${className} ${activeClassName}`.trim() : className
      }
    >
      {children}
    </NavLink>
  );
}

export default AppNavLink;
