import React from "react";
import { useNavigate } from "react-router-dom";

function RouteButton({ to, className, children, type = "button" }) {
  const navigate = useNavigate();

  return (
    <button
      type={type}
      className={className}
      onClick={() => {
        // Backend navigation side effects can be added here later if needed.
        navigate(to);
      }}
    >
      {children}
    </button>
  );
}

export default RouteButton;
