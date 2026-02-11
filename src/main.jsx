import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router.jsx";
import "./index.css";
import { AuthContextProvider } from "./AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <AuthContextProvider>
    <RouterProvider router={router}></RouterProvider>
  </AuthContextProvider>,
);
