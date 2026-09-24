import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/dm-sans";
import "@fontsource/ibm-plex-mono/400.css";
import App from "./App";
import "./style.css";
const root = document.getElementById("root")!;
const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
// The production build ships prerendered HTML; hydrate it. Dev serves an empty root.
if (root.hasChildNodes()) ReactDOM.hydrateRoot(root, app);
else ReactDOM.createRoot(root).render(app);
