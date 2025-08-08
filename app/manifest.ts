import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TopUp Pro - Airtime & Data Services",
    short_name: "TopUp Pro",
    description: "Secure and instant airtime and data top-up services for all networks",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#3b82f6",
    icons: [
      {
        src: "/placeholder-logo.png",
        sizes: "192x192",
        type: "image/png",
      }
    ],
  }
}
