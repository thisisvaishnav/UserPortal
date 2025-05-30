import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { signUp } from "@/lib/api"

export default function Signup() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")
    
    try {
      const result = await signUp(username, password)
      
      if (result.data) {
        setMessage("User created successfully!")
        // Store token
        localStorage.setItem("token", result.data.token)
        // Redirect after successful signup
        setTimeout(() => {
          navigate("/")
        }, 2000)
      } else {
        setMessage(result.error || "Signup failed")
      }
    } catch (error) {
      setMessage("Error connecting to server")
      console.error("Signup error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md bg-zinc-900 rounded-2xl shadow-xl p-8 space-y-6">
      <h1 className="text-white text-3xl font-semibold text-center">Sign Up</h1>
      {message && (
        <div className={`p-3 rounded-md text-center ${message.includes("successfully") ? "bg-green-900/50 text-green-300" : "bg-red-900/50 text-red-300"}`}>
          {message}
        </div>
      )}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Username"
          className="bg-zinc-800 text-white placeholder:text-zinc-400"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          className="bg-zinc-800 text-white placeholder:text-zinc-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button 
          type="submit" 
          className="w-full bg-white text-black hover:bg-zinc-200 transition"
          disabled={isLoading}
        >
          {isLoading ? "Signing up..." : "Sign Up"}
        </Button>
      </form>
    </div>
  )
}
