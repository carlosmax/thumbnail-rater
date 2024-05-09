"use client"

import clsx from "clsx"
import Image from "next/image"
import { isEmpty } from "lodash"
import { useMutation } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { UploadFileResponse } from "@xixixao/uploadstuff"
import { UploadButton } from "@xixixao/uploadstuff/react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

import "@xixixao/uploadstuff/react/styles.css"
import { useRouter } from "next/navigation"

const defaultErrorState = {
  title: "",
  imageA: "",
  imageB: "",
}

const CreatePage = () => {
  const router = useRouter()

  const generateUploadUrl = useMutation(api.files.generateUploadUrl)
  const createThumbnail = useMutation(api.thumbnails.createThumbnail)

  const [imageA, setImageA] = useState("")
  const [imageB, setImageB] = useState("")
  const [errors, setErrors] = useState(defaultErrorState)

  const { toast } = useToast()

  const getImageUrl = (storageId: string) => {
    const url = new URL(`${process.env.NEXT_PUBLIC_CONVEX_SITE_URL}/getImage`)
    url.searchParams.set("storageId", storageId)

    return url.toString()
  }

  return (
    <div className="mt-16">
      <h1 className="text-4xl font-bold mb-8">Create a Thumbnail</h1>

      <p className="text-lg max-w-md mb-8">
        Create your test so that other people can vote on their favorite thumbnail and help you redesign or pick the
        best option.
      </p>

      <form
        onSubmit={async (e) => {
          e.preventDefault()
          let newErrors = {
            ...defaultErrorState,
          }

          const form = e.target as HTMLFormElement
          const formData = new FormData(form)
          const title = formData.get("title") as string

          if (!title) {
            newErrors = { ...newErrors, title: "Please fill in the title" }
          }

          if (!imageA) {
            newErrors = { ...newErrors, imageA: "Please fill in the image A" }
          }

          if (!imageB) {
            newErrors = { ...newErrors, imageB: "Please fill in the image B" }
          }

          setErrors(() => newErrors)

          const hasErrors = Object.values(newErrors).some(Boolean)

          if (hasErrors) {
            toast({
              title: "Form Error",
              description: "Please fill in all fields on the page",
              variant: "destructive",
            })

            return
          }

          const thumbnailId = await createThumbnail({
            title: title,
            aImage: imageA,
            bImage: imageB,
          })

          router.push(`/thumbnails/${thumbnailId}`)
        }}
      >
        <div className="flex flex-col gap-4 mb-8">
          <Label htmlFor="title">Your Test Title</Label>
          <Input
            id="title"
            type="text"
            name="title"
            placeholder="Label your test"
            className={clsx({
              border: errors.title,
              "border-red-500": errors.title,
            })}
          />
          {errors.title && <div className="text-red-800">{errors.title}</div>}
        </div>
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div
            className={clsx("flex flex-col gap-4 rounded p-2", {
              border: errors.imageA,
              "border-red-500": errors.imageA,
            })}
          >
            <h2 className="text-2xl font-bold">Test Image A</h2>

            {imageA && <Image src={getImageUrl(imageA)} width="200" height="200" alt="Image A" />}

            <UploadButton
              uploadUrl={generateUploadUrl}
              fileTypes={["image/*"]}
              onUploadComplete={async (uploaded: UploadFileResponse[]) => {
                console.log((uploaded[0].response as any).storageId)
                setImageA((uploaded[0].response as any).storageId)
                // await saveStorageId({ storageId: (uploaded[0].response as any).storageId })
              }}
              onUploadError={(error: unknown) => {
                // Do something with the error.
                alert(`ERROR! ${error}`)
              }}
            />

            {errors.imageA && <div className="text-red-800">{errors.imageA}</div>}
          </div>
          <div
            className={clsx("flex flex-col gap-4 rounded p-2", {
              border: errors.imageB,
              "border-red-500": errors.imageB,
            })}
          >
            <h2 className="text-2xl font-bold">Test Image B</h2>

            {imageB && <Image src={getImageUrl(imageB)} width="200" height="200" alt="Image B" />}

            <UploadButton
              uploadUrl={generateUploadUrl}
              fileTypes={["image/*"]}
              onUploadComplete={async (uploaded: UploadFileResponse[]) => {
                setImageB((uploaded[0].response as any).storageId)
                // await saveStorageId({ storageId: (uploaded[0].response as any).storageId })
              }}
              onUploadError={(error: unknown) => {
                // Do something with the error.
                alert(`ERROR! ${error}`)
              }}
            />

            {errors.imageB && <div className="text-red-800">{errors.imageB}</div>}
          </div>
        </div>

        <Button>Create Thumbnail Test</Button>
      </form>
    </div>
  )
}

export default CreatePage
