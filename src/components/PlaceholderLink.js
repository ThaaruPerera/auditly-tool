import React from "react";

function PlaceholderLink({ href = "#", className, children }) {
  return (
    <a
      href={href}
      className={className}
      onClick={(event) => {
        event.preventDefault();
        // Backend or external-link logic can be connected here later.
      }}
    >
      {children}
    </a>
  );
}

export default PlaceholderLink;
