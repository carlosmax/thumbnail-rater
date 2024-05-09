import { v } from "convex/values"
import { mutation } from "./_generated/server"

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity()

    if (!user) {
      throw new Error("You must be logged in to upload a thumbnail!")
    }

    // Return an upload URL
    return await ctx.storage.generateUploadUrl()
  },
})
