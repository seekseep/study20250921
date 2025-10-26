import { getImagesAction } from "./actions/image"
import { ImagesTable } from "./components/ImagesTable"
import { Breadcrumb } from "@/components/Breadcrumb"
import { createClient } from "@supabase/supabase-js"
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from "@/constants"

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

export default async function Page() {
  const result = await getImagesAction()

  if (result.error) {
    return <div>Error: {result.error.message}</div>
  }

  const images = result.data.map(image => ({
    ...image,
    url: image.path
      ? supabase.storage.from('images').getPublicUrl(image.path).data.publicUrl
      : undefined
  }))

  return (
    <div>
      <Breadcrumb items={[{ label: "Images" }]} />
      <h1 className="text-2xl font-bold mb-4">Images</h1>
      <ImagesTable data={images} />
    </div>
  )
}
