import { Routes, Route } from "react-router-dom"
import Chat from "./components/chat"
import Register from "./pages/Register.jsx"
import Login from "./pages/Login"
// import { useAuth } from "./hooks/useAuth"
import { AuthContext } from "./contexts/AuthContext"
import "./app.css"
import { useContext } from "react"

export default function App() {

  // const { authState, user, logout } = useAuth();
  // const { authState, user, logout } = useContext(AuthContext)


  return (
    <div className="app">
      <div className="header">
        <p>Header TBA</p>
        {/* {user
          ? <p>
            <span>Welcome, {user.email}</span>
            <button onClick={logout}>Logout</button>
          </p>
          : <p>Header TBA</p>}  */}
      </div>

      <div className="main">
        <Routes>
          {/*TODO add route for "/" with homepage content  */}
          <Route path="register" element={<Register />} />
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