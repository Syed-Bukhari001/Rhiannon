import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";
import { asset } from "./utils/assets.js";
import "./styles.css";

document.documentElement.style.setProperty("--hero-image", `url("${asset("assets/hero-alpine-hiker.png")}")`);
document.documentElement.style.setProperty("--topo-texture", `url("${asset("assets/topo-texture.png")}")`);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
