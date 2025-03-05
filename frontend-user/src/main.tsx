import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App"; // ✅ Removed `.tsx` (not needed)
import "./index.css";
import { AuthProvider } from "./context/AuthContext"; // ✅ Ensure AuthContext exists

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider> 
      <App />
    </AuthProvider>
  </StrictMode>
);
