// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

// Pages
import Home from "./pages/Home.jsx";
import Services from "./pages/Services.jsx";
import ProjectsIndex from "./pages/ProjectsIndex.jsx";
import ProjectDetail from "./pages/ProjectDetail.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";

// 👇 Agrega el ScrollToTop
import ScrollToTop from "./router/ScrollToTop.jsx";

// Componente raíz que envuelve App con ScrollToTop
function Root() {
  return (
    <>
      <ScrollToTop behavior="auto" />
      <App />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />, // 👈 antes era <App />
    children: [
      { index: true, element: <Home /> },
      { path: "services", element: <Services /> },

      // Proyectos
      { path: "projects", element: <ProjectsIndex /> },
      { path: "projects/cat/:service", element: <ProjectsIndex /> },
      { path: "projects/id/:id", element: <ProjectDetail /> },

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
