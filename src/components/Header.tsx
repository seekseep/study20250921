import Link from "next/link"

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900 hover:text-gray-700">
              Image Manager
            </Link>
          </div>
          <nav className="flex gap-4">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              Images
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
