import {createFileRoute} from '@tanstack/react-router'
import {EpubReader} from "@components/EpubReader.tsx";

export const Route = createFileRoute('/_public/read')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
  <EpubReader folderUrl={"https://namluong.sgp1.digitaloceanspaces.com/books/UnzipBooks/test2/"} />
  </div>
}
