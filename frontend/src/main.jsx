// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

// Pages
import Home from "./pages/Home.jsx";
import Services from "./pages/Services.jsx";
import ProjectsIndex from "./pages/ProjectsIndex.jsx";   // ⬅️ nueva lista
import ProjectDetail from "./pages/ProjectDetail.jsx";   // ⬅️ nuevo detalle
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "services", element: <Services /> },

      // Proyectos
      { path: "projects", element: <ProjectsIndex /> },            // todos
      { path: "projects/cat/:service", element: <ProjectsIndex /> }, // por categoría (automation|webdev|domotics|it)
      { path: "projects/id/:id", element: <ProjectDetail /> },     // detalle por ID (ck-fitness, etc.)

      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },

      { path: "*", element: <div className="p-8">404 — No encontrado</div> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
