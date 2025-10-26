import { getImagesAction } from "./actions/image"
import { ImagesTable } from "./components/ImagesTable"
import { Breadcrumb } from "@/components/Breadcrumb"

export default async function Page() {
  const result = await getImagesAction()

  if (result.error) {
    return <div>Error: {result.error.message}</div>
  }

  const images = result.data

  return (
    <div>
      <Breadcrumb items={[{ label: "Images" }]} />
      <h1 className="text-2xl font-bold mb-4">Images</h1>
      <ImagesTable data={images} />
    </div>
  )
}
