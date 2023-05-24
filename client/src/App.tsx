import { Routes, Route } from "react-router-dom"
import Chat from "./components/chat"
import Login from "./pages/login"
import "./app.css"

export default function App() {


  return (
    <div className="app">
      <div className="header">
        Header TBA
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