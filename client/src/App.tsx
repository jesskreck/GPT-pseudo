import { Routes, Route, Navigate } from "react-router-dom";
import Chat from "./pages/Chat.tsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login";
import { AuthContext } from "./contexts/AuthContext";
import "./app.css";
import { useContext } from "react";
import Spinner from "./components/Spinner2.jsx";

export default function App() {
  const { tokenChecked, authState, user, logout } = useContext(AuthContext);

  const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    if (tokenChecked) {
      return authState?.isAuthenticated
        ? children
        : <Navigate to="/login" replace />
    } else {
      return <Spinner/>
    }

  };

  return (
    <div className="app">
      <nav className="header">
        {user
          ? 
          <p>
            <span>Welcome, {user.email} </span>
            <button onClick={logout}>Logout</button>
          </p>
          : <p>Welcome!</p>
        }
      </nav>

      <div className="main">
        <Routes>
          <Route path="/" />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route
            path="chat"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>

      <nav className="footer">
        <p>Made by Jessica</p>
      </nav>
    </div>
  );
}
