"use client";

import React from "react";
import { colors, spacing, radius } from "@/theme/tokens";

interface ButtonProps {
 children: React.ReactNode;
 variant?: "primary" | "secondary" | "tertiary";
 onPress?: () => void;
 disabled?: boolean;
 fullWidth?: boolean;
}

const variantStyles: Record<string, React.CSSProperties> = {
 primary: {
 backgroundColor: colors.phosphor,
 },
 secondary: {
 backgroundColor: colors.surfaceContainerHigh,
 borderColor: colors.outlineVariant,
 borderWidth: 1,
 borderStyle: "solid",
 },
 tertiary: {
 backgroundColor: colors.amber,
 },
};

export function Button(props: ButtonProps) {
 const {
 children,
 variant = "primary",
 onPress,
 disabled = false,
 fullWidth = false,
 } = props;

 const buttonStyle: React.CSSProperties = {
 ...styles.base,
 ...variantStyles[variant],
 ...(fullWidth ? styles.fullWidth : {}),
 ...(disabled ? styles.disabled : {}),
 };

 return (
 <button
 type="button"
 style={buttonStyle}
 onClick={onPress}
 disabled={disabled}
 >
 <span style={styles.text}>{children}</span>
 </button>
 );
}

const styles: Record<string, React.CSSProperties> = {
 base: {
 display: "flex",
 alignItems: "center",
 justifyContent: "center",
 borderRadius: radius.btn,
 paddingLeft: spacing[6],
 paddingRight: spacing[6],
 paddingTop: spacing[3],
 paddingBottom: spacing[3],
 border: "none",
 cursor: "pointer",
 },
 disabled: {
 opacity: 0.5,
 },
 fullWidth: {
 width: "100%",
 },
 text: {
 color: colors.obsidian,
 fontWeight: 600,
 },
};
