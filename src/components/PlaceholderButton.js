import React from "react";

function PlaceholderButton({ className, children, onClick, type = "button" }) {
  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default PlaceholderButton;
