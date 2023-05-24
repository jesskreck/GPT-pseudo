import { Routes, Route } from "react-router-dom"
import Chat from "./components/chat"
import Login from "./pages/login"
import { useAuth } from "./hooks/useAuth"
import "./app.css"
import { useEffect } from "react"

export default function App() {

  const { authState, user, logout } = useAuth()
  useEffect(() => {
    console.log("use effect fired");
  
  }, [authState])
  

  return (
    <div className="app">
      <div className="header">
        {user
          ? <p>
            <span>Welcome, {user.email}</span>
            <button onClick={logout}>Logout</button>
          </p>
          : <p>Header TBA</p>} 
      </div>

      <div className="main">
        <Routes>
          {/*TODO add route for "/" with homepage content  */}
          <Route path="login" element={<Login />} />
          <Route path="chat" element={<Chat />} />
        </Routes>
      </div>

      <nav className="footer">
        <p>Made by Jessica</p>
      </nav>
    </div>
  )
}