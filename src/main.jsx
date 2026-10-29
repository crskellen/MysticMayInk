import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

const rootElement = document.getElementById("root");
const app = (
  <StrictMode>
    <App initialPath={window.location.pathname} />
  </StrictMode>
);

if (rootElement.querySelector("main")) {
  hydrateRoot(rootElement, app);
} else {
  createRoot(rootElement).render(app);
}
