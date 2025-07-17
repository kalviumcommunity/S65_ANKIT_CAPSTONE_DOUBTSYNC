import React from "react";

export const Button = ({ children, className = "", ...props }) => {
  return (
    <button
      className={`px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition duration-300 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
