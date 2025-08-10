import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/markdown-edit')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/markdown-edit"!</div>
}
