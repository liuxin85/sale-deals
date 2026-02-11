import { createBrowserRouter } from "react-router-dom";
import Signin from "./components/Signin";
import Dashboard from "./routes/Dashboard";
import Header from "./components/Header";
import Signup from "./components/Signup";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Signin />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/dashboard",
    element: (
      <>
        <Header />
        <Dashboard />
      </>
    ),
  },
]);
