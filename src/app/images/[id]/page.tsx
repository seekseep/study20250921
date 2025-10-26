import { notFound } from "next/navigation"
import { getImageByIdAction } from "@/app/actions/image"
import { createClient } from "@supabase/supabase-js"
import { SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL } from "@/constants"
import { Breadcrumb } from "@/components/Breadcrumb"
import { Accordion } from "@/components/Accordion"
import { JsonViewer } from "@/components/JsonViewer"
import { Tabs } from "@/components/Tabs"
import { ImageSummary } from "./components/ImageSummary"

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

export default async function ImageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const result = await getImageByIdAction({ id })

  if (result.error) {
    return <div>Error: {result.error.message}</div>
  }

  if (!result.data) {
    notFound()
  }

  const image = result.data

  const { data: imageData } = supabase.storage
    .from('images')
    .getPublicUrl(image.path)

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Images", href: "/" },
          { label: image.fileName }
        ]}
      />

      <h1 className="text-2xl font-bold mb-4">Image Details</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/2 max-w-2xl min-w-96">
          <div className="relative w-full aspect-square bg-gray-100 border border-gray-300 rounded overflow-hidden">
            <img
              src={imageData.publicUrl}
              alt={image.fileName}
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <div className="w-full lg:w-1/2">
          <Tabs
            tabs={[
              {
                id: 'info',
                label: '情報',
                content: (
                  <div className="border border-gray-300 rounded p-4">
                    <dl className="grid grid-cols-1 gap-4">
                      <div>
                        <dt className="font-semibold">ID:</dt>
                        <dd className="font-mono text-xs">{image.id}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold">File Name:</dt>
                        <dd className="font-mono text-xs">{image.fileName}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold">Path:</dt>
                        <dd className="font-mono text-xs">{image.path}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold">Line User ID:</dt>
                        <dd className="font-mono text-xs">{image.lineUserId || '-'}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold">Line Message ID:</dt>
                        <dd className="font-mono text-xs">{image.lineMessageId || '-'}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold">Uploaded At:</dt>
                        <dd>{new Date(image.uploadedAt).toLocaleString()}</dd>
                      </div>
                      {image.metaJson && (
                        <div className="col-span-1">
                          <Accordion title="Meta JSON">
                            <JsonViewer data={image.metaJson} />
                          </Accordion>
                        </div>
                      )}
                    </dl>
                  </div>
                ),
              },
              {
                id: 'summary',
                label: '要約',
                content: (
                  <div className="border border-gray-300 rounded p-4">
                    <ImageSummary image={image} />
                  </div>
                ),
              },
            ]}
          />
        </div>
      </div>
    </div>
  )
}
