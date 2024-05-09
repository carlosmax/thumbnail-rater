"use client"

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { ModeToggle } from "./mode-toggle"
import Link from "next/link"

export const Header = () => {
  return (
    <div className="border-b">
      <div className="h-16 container flex justify-between items-center">
        <Link href="/">ThumbnailRater</Link>

        <div className="flex gap-8">
          <SignedIn>
            <Link href="/dashboard" className="link">
              Dashboard
            </Link>
            <Link href="/create">Create Test</Link>
          </SignedIn>
          <SignedOut>
            <Link href="/pricing">Pricing</Link>
            <Link href="/about">About</Link>
          </SignedOut>
        </div>

        <div className="flex gap-4 items-center">
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <ModeToggle />
        </div>
      </div>
    </div>
  )
}
