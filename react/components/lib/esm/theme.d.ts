import React from "react";
import { ThemeProvider } from "@mui/material/styles";
export interface Theme {
    primary?: string;
    secondary?: string;
    error?: string;
    warning?: string;
}
export interface ThemeProvider {
    children: React.ReactNode;
    theme?: Theme;
}
export declare const WithTheme: ({ children, theme }: ThemeProvider) => JSX.Element;
//# sourceMappingURL=theme.d.ts.map