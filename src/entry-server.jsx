import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App.jsx";

export function render(url) {
  return renderToString(
    <StrictMode>
      <App initialPath={url} />
    </StrictMode>,
  );
}
