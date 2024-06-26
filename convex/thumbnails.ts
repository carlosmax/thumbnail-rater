import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { paginationOptsValidator } from "convex/server"

export const createThumbnail = mutation({
  args: {
    title: v.string(),
    aImage: v.string(),
    bImage: v.string(),
    profileImage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity()

    if (!user) {
      throw new Error("You must be logged in to create a thumbnail!")
    }

    return await ctx.db.insert("thumbnails", {
      title: args.title,
      userId: user.subject,
      aImage: args.aImage,
      aVotes: 0,
      bImage: args.bImage,
      bVotes: 0,
      voteIds: [],
      profileImage: args.profileImage,
      comments: [],
    })
  },
})

export const getThumbnailsForUser = query({
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity()

    if (!user) {
      return []
    }

    return ctx.db
      .query("thumbnails")
      .filter((q) => q.eq(q.field("userId"), user.subject))
      .collect()
  },
})

export const getThumbnail = query({
  args: {
    thumbnailId: v.id("thumbnails"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.thumbnailId)
  },
})

export const voteOnThumbnail = mutation({
  args: {
    thumbnailId: v.id("thumbnails"),
    imageId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = (await ctx.auth.getUserIdentity())?.subject

    if (!userId) {
      throw new Error("You must be logged in to vote!")
    }

    const thumbnail = await ctx.db.get(args.thumbnailId)

    if (!thumbnail) {
      throw new Error("invalid thumbnail id")
    }

    if (thumbnail.voteIds.includes(userId)) {
      throw new Error("You've already voted")
    }

    if (thumbnail.aImage === args.imageId) {
      thumbnail.aVotes++

      await ctx.db.patch(thumbnail._id, {
        aVotes: thumbnail.aVotes,
        voteIds: [...thumbnail.voteIds, userId],
      })
    } else {
      thumbnail.bVotes++

      await ctx.db.patch(thumbnail._id, {
        bVotes: thumbnail.bVotes,
        voteIds: [...thumbnail.voteIds, userId],
      })
    }
  },
})

export const getRecentThumbnails = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    return await ctx.db.query("thumbnails").order("desc").paginate(args.paginationOpts)
  },
})
