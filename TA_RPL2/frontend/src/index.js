import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { CartProvider } from "./components/cartcontext";
import { AuthProvider } from "./components/authcontext";
import "./styles/index.css";
import "./styles/responsif.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);
