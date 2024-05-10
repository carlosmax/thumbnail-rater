import { httpRouter } from "convex/server"
import { httpAction } from "./_generated/server"
import { internal } from "./_generated/api"

const http = httpRouter()

http.route({
  path: "/getImage",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const { searchParams } = new URL(request.url)
    // This storageId param should be an Id<"_storage">
    const storageId = searchParams.get("storageId")!
    const blob = await ctx.storage.get(storageId)
    if (blob === null) {
      return new Response("Image not found", {
        status: 404,
      })
    }
    return new Response(blob)
  }),
})

http.route({
  path: "/stripe",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const signature = request.headers.get("stripe-signature") as string

    const result = await ctx.runAction(internal.stripe.fulfill, {
      payload: await request.text(),
      signature,
    })

    if (result.success) {
      return new Response(null, {
        status: 200,
      })
    } else {
      return new Response("Webhook Error", {
        status: 400,
      })
    }
  }),
})

http.route({
  path: "/clerk",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const payloadString = await request.text()
    const headerPayload = request.headers

    try {
      const result = await ctx.runAction(internal.clerk.fulfill, {
        payload: payloadString,
        headers: {
          "svix-id": headerPayload.get("svix-id")!,
          "svix-timestamp": headerPayload.get("svix-timestamp")!,
          "svix-signature": headerPayload.get("svix-signature")!,
        },
      })

      switch (result.type) {
        case "user.created":
          await ctx.runMutation(internal.users.createUser, {
            email: result.data.email_addresses[0]?.email_address,
            userId: result.data.id,
          })
      }

      return new Response(null, {
        status: 200,
      })
    } catch (err) {
      console.error(err)
      return new Response("Webhook Error", {
        status: 400,
      })
    }
  }),
})

export default http
