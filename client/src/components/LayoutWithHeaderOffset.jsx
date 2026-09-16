import React from "react";

/**
 * Adds enough top space for the fixed/sticky header
 * so page content never appears underneath the navbar.
 */
const LayoutWithHeaderOffset = ({ children }) => {
  return (
    <div style={{ paddingTop: "80px" }}>
      {children}
    </div>
  );
};

export default LayoutWithHeaderOffset;