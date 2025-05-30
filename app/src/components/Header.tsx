import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

const Header = () => {
  return (
    <header className="w-full border-b border-zinc-800">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-bold text-white">
            My App
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link to="/" className="text-sm font-medium text-zinc-400 hover:text-white hover:underline">
              Home
            </Link>
            <Link to="/about" className="text-sm font-medium text-zinc-400 hover:text-white hover:underline">
              About
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800 hover:text-white">
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild className="bg-white text-black hover:bg-zinc-200">
            <Link to="/signup">Sign up</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

export default Header 