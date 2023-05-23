//NOTE app.tsx === app.js

import React, { BrowserRouter, Routes, Route } from "react-router-dom"
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
        <BrowserRouter>
          <Routes>
            <Route path="login" element={<Login />} />
            <Route path="/" element={<Chat />} />
          </Routes>
        </BrowserRouter>
      </div>

      <nav className="footer">
        <p>Made by Jessica</p>
      </nav>
    </div>
  )
}