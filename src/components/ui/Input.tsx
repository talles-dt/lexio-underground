import React from "react";
import { colors, radius, typography } from "@/theme/tokens";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
 const { style, ...rest } = props;
 return <input style={{ ...styles.input, ...(style as React.CSSProperties) }} {...rest} />;
}

export default Input;

const styles: Record<string, React.CSSProperties> = {
 input: {
 backgroundColor: colors.surfaceContainerHigh,
 borderRadius: radius.btn,
 color: colors.onSurface,
 fontFamily: typography.body.fontFamily,
 padding: 12,
 border: "none",
 outline: "none",
 },
};
