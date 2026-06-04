import React from "react";

interface CardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export function Card({ children, style }: CardProps) {
  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: 8,
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        padding: 16,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export default Card;
