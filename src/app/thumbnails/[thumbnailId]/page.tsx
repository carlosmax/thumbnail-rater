"use client"

import Image from "next/image"
import { useMutation, useQuery } from "convex/react"
import { useParams } from "next/navigation"
import { api } from "../../../../convex/_generated/api"
import { Id } from "../../../../convex/_generated/dataModel"
import { getImageUrl } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useSession } from "@clerk/nextjs"
import { Progress } from "@/components/ui/progress"

const ThumbnailPage = () => {
  const session = useSession()
  const params = useParams<{ thumbnailId: Id<"thumbnails"> }>()
  const thumbnailId = params.thumbnailId
  const voteOnThumbnail = useMutation(api.thumbnails.voteOnThumbnail)
  const thumbnail = useQuery(api.thumbnails.getThumbnail, {
    thumbnailId,
  })

  if (!thumbnail || !session?.session) {
    return <div>Loading...</div>
  }

  const hasVoted = thumbnail.voteIds.includes(session.session?.user.id)

  const getVotesFor = (imageId: string) => {
    if (!thumbnail) return 0

    return thumbnail?.aImage === imageId ? thumbnail.aVotes : thumbnail?.bVotes
  }

  const votePercent = (imageId: string) => {
    if (!thumbnail) return 0

    const totalVotes = thumbnail?.aVotes + thumbnail?.bVotes

    if (totalVotes === 0) return 0

    return Math.round(getVotesFor(imageId) / totalVotes) * 100
  }

  return (
    <div className="mt-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-4 items-center">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-4">Test Image A</h2>

          {thumbnail?.aImage && (
            <Image src={getImageUrl(thumbnail?.aImage)} width="300" height="600" alt="Image A" className="w-full" />
          )}

          {hasVoted ? (
            <>
              <Progress value={votePercent(thumbnail.aImage)} className="w-full" />
              <div className="text-lg">{getVotesFor(thumbnail.aImage)} votes</div>
            </>
          ) : (
            <Button
              size={"lg"}
              className="w-fit"
              onClick={() => {
                voteOnThumbnail({
                  thumbnailId,
                  imageId: thumbnail?.aImage,
                })
              }}
            >
              Vote A
            </Button>
          )}
        </div>

        <div className="flex flex-col gap-4 items-center">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-4">Test Image B</h2>

          {thumbnail?.bImage && (
            <Image src={getImageUrl(thumbnail?.bImage)} width="600" height="600" alt="Image B" className="w-full" />
          )}

          {hasVoted ? (
            <>
              <Progress value={votePercent(thumbnail.bImage)} className="w-full" />
              <div className="text-lg">{getVotesFor(thumbnail.bImage)} votes</div>
            </>
          ) : (
            <Button
              size={"lg"}
              className="w-fit"
              onClick={() => {
                voteOnThumbnail({
                  thumbnailId,
                  imageId: thumbnail?.bImage,
                })
              }}
            >
              Vote B
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ThumbnailPage
