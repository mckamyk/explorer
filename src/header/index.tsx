import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { Link } from "@tanstack/react-router"

export default () => {
  return (
    <div className="sticky top-0 shadow-white/5 flex px-2 items-center h-12 shadow-lg bg-black/25">
      <Link to="/" className="flex items-center">
        <MagnifyingGlassIcon className="h-8 w-8" />
        Explorer
      </Link>
    </div >
  )
}
