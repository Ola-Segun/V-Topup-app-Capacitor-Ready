// "use client"

// import { Moon, Sun } from "lucide-react"
// import { useTheme } from "next-themes"
// import { Button } from "@/components/ui/button"
// import { useEffect, useState } from "react"

// export function ThemeToggle() {
//   const { setTheme, theme, resolvedTheme } = useTheme()
//   const [mounted, setMounted] = useState(false)

//   useEffect(() => {
//     setMounted(true)
//   }, [])

//   if (!mounted) {
//     return (
//       <Button variant="ghost" size="icon" className="material-card w-9 h-9">
//         <div className="w-4 h-4" />
//       </Button>
//     )
//   }

//   const toggleTheme = () => {
//     setTheme(resolvedTheme === "dark" ? "light" : "dark")
//   }

//   return (
//     <Button
//       variant="ghost"
//       size="icon"
//       onClick={toggleTheme}
//       className="material-card w-9 h-9 hover:shadow-lg transition-all duration-200"
//     >
//       <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
//       <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
//       <span className="sr-only">Toggle theme</span>
//     </Button>
//   )
// }


"use client"

import * as React from "react"
import { Moon, Sun, Monitor, Palette, Crown, Check, Sparkles } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

const themes = [
  // Basic Themes
  { name: "Light", value: "light", icon: Sun, premium: false, category: "basic" },
  { name: "Dark", value: "dark", icon: Moon, premium: false, category: "basic" },
  { name: "System", value: "system", icon: Monitor, premium: false, category: "basic" },
  { name: "Plain", value: "plain", icon: Palette, premium: false, category: "basic" },

  // Premium Themes - Light Variants
  { name: "Ocean Light", value: "ocean-light", icon: Sparkles, premium: true, category: "premium-light" },
  { name: "Forest Light", value: "forest-light", icon: Sparkles, premium: true, category: "premium-light" },
  { name: "Sunset Light", value: "sunset-light", icon: Sparkles, premium: true, category: "premium-light" },
  { name: "Royal Light", value: "royal-light", icon: Crown, premium: true, category: "premium-light" },
  { name: "Rose Light", value: "rose-light", icon: Crown, premium: true, category: "premium-light" },
  { name: "Emerald Light", value: "emerald-light", icon: Sparkles, premium: true, category: "premium-light" },
  { name: "Crimson Light", value: "crimson-light", icon: Sparkles, premium: true, category: "premium-light" },

  // Premium Themes - Dark Variants
  { name: "Ocean Dark", value: "ocean-dark", icon: Sparkles, premium: true, category: "premium-dark" },
  { name: "Forest Dark", value: "forest-dark", icon: Sparkles, premium: true, category: "premium-dark" },
  { name: "Sunset Dark", value: "sunset-dark", icon: Sparkles, premium: true, category: "premium-dark" },
  { name: "Royal Dark", value: "royal-dark", icon: Crown, premium: true, category: "premium-dark" },
  { name: "Rose Dark", value: "rose-dark", icon: Crown, premium: true, category: "premium-dark" },
  { name: "Emerald Dark", value: "emerald-dark", icon: Sparkles, premium: true, category: "premium-dark" },
  { name: "Crimson Dark", value: "crimson-dark", icon: Sparkles, premium: true, category: "premium-dark" },
  { name: "Midnight", value: "midnight", icon: Crown, premium: true, category: "premium-dark" },
]

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [isPremium] = React.useState(true) // Demo: user has premium access
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleThemeChange = React.useCallback(
    (newTheme: string, isPremiumTheme: boolean) => {
      if (isPremiumTheme && !isPremium) {
        toast.error("Premium theme requires upgrade", {
          description: "Upgrade to Pro to access premium themes",
          action: {
            label: "Upgrade",
            onClick: () => console.log("Upgrade clicked"),
          },
        })
        return
      }

      setTheme(newTheme)
      const themeName = themes.find((t) => t.value === newTheme)?.name || newTheme
      toast.success(`Theme changed to ${themeName}`)
    },
    [setTheme, isPremium],
  )

  const currentTheme = themes.find((t) => t.value === theme)
  const CurrentIcon = currentTheme?.icon || Sun

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="w-8 h-8 sm:w-9 sm:h-9 px-0 touch-manipulation">
        <div className="h-4 w-4 sm:h-[1.2rem] sm:w-[1.2rem]" />
      </Button>
    )
  }

  const basicThemes = themes.filter((t) => t.category === "basic")
  const premiumLightThemes = themes.filter((t) => t.category === "premium-light")
  const premiumDarkThemes = themes.filter((t) => t.category === "premium-dark")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="w-8 h-8 sm:w-9 sm:h-9 px-0 touch-manipulation">
          <CurrentIcon className="h-4 w-4 sm:h-[1.2rem] sm:w-[1.2rem] transition-all" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 sm:w-64 p-2 max-h-[80vh] overflow-y-auto w-full" sideOffset={8}>
        
        
        <DropdownMenuLabel className="text-xs font-medium px-2 py-1.5">Choose Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="flex">

        <div className="">


        {/* Basic Themes */}
        <div className="space-y-1">
          {basicThemes.map((themeOption) => {
            const Icon = themeOption.icon
            const isActive = theme === themeOption.value

            return (
              <DropdownMenuItem
                key={themeOption.value}
                onClick={() => handleThemeChange(themeOption.value, false)}
                className="text-xs text-muted-foreground px-2 py-1 flex items-center gap-2 w-fit cursor-pointer rounded-md hover:bg-accent focus:bg-accent touch-manipulation min-h-[44px] sm:min-h-[40px]"
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  {/* <span className="text-sm font-medium">{themeOption.name}</span> */}
                </div>
                {isActive && <Check className="h-4 w-4 text-primary" />}
              </DropdownMenuItem>
            )
          })}
        </div>
        </div>


          <div className="">

        {/* Premium Light Themes */}
        <DropdownMenuLabel className="text-xs text-muted-foreground px-2 py-1 flex items-center gap-2">
          <Sun className="h-3 w-3" />
          Premium Light
        </DropdownMenuLabel>

        <div className="space-y-1">
          {premiumLightThemes.map((themeOption) => {
            const Icon = themeOption.icon
            const isActive = theme === themeOption.value
            const canAccess = isPremium

            return (
              <DropdownMenuItem
                key={themeOption.value}
                onClick={() => handleThemeChange(themeOption.value, true)}
                className={`flex items-center justify-between px-2 py-2 cursor-pointer rounded-md hover:bg-accent focus:bg-accent touch-manipulation min-h-[44px] sm:min-h-[40px] ${
                  !canAccess ? "opacity-60" : ""
                }`}
                disabled={!canAccess}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{themeOption.name}</span>
                  {!canAccess && (
                    <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                      Pro
                    </Badge>
                  )}
                </div>
                {isActive && <Check className="h-4 w-4 text-primary" />}
              </DropdownMenuItem>
            )
          })}
        </div>
          </div>


          <div className="">

        {/* Premium Dark Themes */}
        <DropdownMenuLabel className="text-xs text-muted-foreground px-2 py-1 flex items-center gap-2">
          <Moon className="h-3 w-3" />
          Premium Dark
        </DropdownMenuLabel>

        <div className="space-y-1">
          {premiumDarkThemes.map((themeOption) => {
            const Icon = themeOption.icon
            const isActive = theme === themeOption.value
            const canAccess = isPremium

            return (
              <DropdownMenuItem
                key={themeOption.value}
                onClick={() => handleThemeChange(themeOption.value, true)}
                className={`flex items-center justify-between px-2 py-2 cursor-pointer rounded-md hover:bg-accent focus:bg-accent touch-manipulation min-h-[44px] sm:min-h-[40px] ${
                  !canAccess ? "opacity-60" : ""
                }`}
                disabled={!canAccess}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{themeOption.name}</span>
                  {!canAccess && (
                    <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                      Pro
                    </Badge>
                  )}
                </div>
                {isActive && <Check className="h-4 w-4 text-primary" />}
              </DropdownMenuItem>
            )
          })}
        </div>
          </div>
        </div>

        {!isPremium && (
          <>
            <DropdownMenuSeparator />
            <div className="px-2 py-2">
              <Button
                size="sm"
                className="w-full text-xs h-8 touch-manipulation"
                onClick={() => toast.info("Upgrade feature coming soon!")}
              >
                <Crown className="h-3 w-3 mr-2" />
                Upgrade to Pro
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
