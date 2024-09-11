
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/landing')({
  component: Landing,
})

function Landing() {
  return <div className="p-2">Hello from About!</div>
}