import { BrowserRouter, Routes, Route } from "react-router-dom"
import Header from "./components/Header"
import Signup from "./components/signup"
import Login from "./components/Login"

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-svh bg-zinc-950 text-white">   
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <Routes>
            <Route path="/" element={<div className="text-2xl">Welcome to My App</div>} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<div>Page not found</div>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App 