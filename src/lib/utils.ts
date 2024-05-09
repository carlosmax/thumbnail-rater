import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getImageUrl = (storageId: string) => {
  const url = new URL(`${process.env.NEXT_PUBLIC_CONVEX_SITE_URL}/getImage`)
  url.searchParams.set("storageId", storageId)

  return url.toString()
}
