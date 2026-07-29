/// <reference types="react" />
import { DefaultTheme } from 'react-native-paper';
import { ThemeProvider } from './theme';
type DefaultTheme_T = typeof DefaultTheme;
type DefaultThemeColors_T = typeof DefaultTheme.colors;
declare module "react-native-paper" {
    interface Theme extends DefaultTheme_T {
        error: string;
    }
}
declare global {
    namespace ReactNativePaper {
        interface ThemeColors extends DefaultThemeColors_T {
            error: string;
            warning: string;
            secondary: string;
        }
    }
}
export declare const WithTheme: ({ children, theme }: ThemeProvider) => JSX.Element;
export {};
//# sourceMappingURL=theme.native.d.ts.map