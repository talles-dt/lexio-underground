"use client";

import React from "react";
import { colors } from "@/theme/tokens";

interface CardProps {
 children: React.ReactNode;
 style?: React.CSSProperties;
}

export function Card({ children, style }: CardProps) {
 return <div style={{ ...styles.card, ...style }}>{children}</div>;
}

const styles: Record<string, React.CSSProperties> = {
 card: {
 backgroundColor: colors.surface,
 borderColor: colors.borderSubtle,
 borderRadius: 12,
 borderWidth: 1,
 borderStyle: "solid",
 padding: 16,
 },
};
