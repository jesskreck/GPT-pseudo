//NOTE app.tsx === app.js

import React, { BrowserRouter, Routes, Route } from "react-router-dom"
import Chat from "./components/chat"
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
          {/* <Route path="/" element={ } />
        <Route path="login" element={ } /> */}
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