// "use client"
// import { ThemeProvider as NextThemesProvider } from "next-themes"
// import type { ThemeProviderProps } from "next-themes"

// export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
//   return <NextThemesProvider {...props}>{children}</NextThemesProvider>
// }

"use client"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      {...props}
      themes={[
        "light",
        "dark",
        "system",
        "plain",
        "ocean-light",
        "ocean-dark",
        "forest-light",
        "forest-dark",
        "sunset-light",
        "sunset-dark",
        "royal-light",
        "royal-dark",
        "rose-light",
        "rose-dark",
        "emerald-light",
        "emerald-dark",
        "crimson-light",
        "crimson-dark",
        "midnight",
      ]}
    >
      {children}
    </NextThemesProvider>
  )
}
