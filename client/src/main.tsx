import { createRoot } from "react-dom/client";
import axios from "axios";
import App from "./App";
import "./index.css";

import { setupClientApiBridge } from "./lib/clientApi";

if (import.meta.env.VITE_API_BASE_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
}

if (typeof window !== "undefined" && window.location.hostname.includes("github.io")) {
  setupClientApiBridge();
}

createRoot(document.getElementById("root")!).render(<App />);

