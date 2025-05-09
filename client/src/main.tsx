//main.tsx === index.js

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { PromptProvider } from "./contexts/PromptContext.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
  <BrowserRouter>
    <AuthProvider>
      <PromptProvider>
        <App />
      </PromptProvider>
    </AuthProvider>
  </BrowserRouter>
  // </React.StrictMode>,
);
