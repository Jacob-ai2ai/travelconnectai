import "./global.css";
import { createRoot } from "react-dom/client";
import App from "./App";

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root element not found");
}

// Use a global variable to track if root has been created
if (!(window as any).__react_root__) {
  const root = createRoot(container);
  (window as any).__react_root__ = root;
  root.render(<App />);
} else {
  // Re-render on existing root (for development hot reloading)
  (window as any).__react_root__.render(<App />);
}
