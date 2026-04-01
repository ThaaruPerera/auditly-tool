import React from "react";
import { ReactComponent as AuditlyLogo } from "../assets/auditly.svg";

function Logo({ className = "", ariaLabel = "Auditly logo" }) {
  return (
    <div className={className} aria-label={ariaLabel} role="img">
      <AuditlyLogo className="block h-auto w-full" />
    </div>
  );
}

export default Logo;
