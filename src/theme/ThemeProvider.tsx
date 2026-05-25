"use client";

import { createContext, useContext } from "react";
import { theme } from "./tokens";
import type { Theme } from "./tokens";

const ThemeContext = createContext<Theme>(theme);

export const ThemeProvider = ThemeContext.Provider;

export function useTheme(): Theme {
  return useContext(ThemeContext);
}
