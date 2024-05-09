"use client"

import { PropsWithChildren } from "react"
import { ClerkProvider, useAuth } from "@clerk/nextjs"
import { ptBR } from "@clerk/localizations"
import { ConvexProviderWithClerk } from "convex/react-clerk"
import { ConvexReactClient } from "convex/react"
import { ThemeProvider } from "next-themes"

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL as string)

export function Providers({ children }: PropsWithChildren) {
  return (
    <ClerkProvider localization={ptBR} publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  )
}
