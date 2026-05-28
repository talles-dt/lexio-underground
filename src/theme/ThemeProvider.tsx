"use client";

import React, { createContext, useContext } from "react";
import * as tokens from "./tokens";
export { tokens };
export type Theme = typeof tokens;

const ThemeContext = createContext<Theme>(tokens);

export const ThemeProvider = ThemeContext.Provider;

export function useTheme(): Theme {
  return useContext(ThemeContext);
}
