import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";

const Home = lazy(() => import("./Components/Home/Home"));
const Layout = lazy(() => import("./Components/Layout/Layout"));
const File = lazy(() => import("./Components/file"));
const Demo = lazy(() => import("./Components/Home/Demo")); // Import demo component

import Loading from "./Components/Loading/Loading";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={
        <Suspense fallback={<Loading />}>
          <Layout />
        </Suspense>
      }
    >
      <Route
        path=""
        element={
          <Suspense fallback={<Loading />}>
            <Home />
          </Suspense>
        }
      />

      <Route
        path="/file"
        element={
          <Suspense fallback={<Loading />}>
            <File />
          </Suspense>
        }
      />

      <Route
        path="/demo" // Add route for demo component
        element={
          <Suspense fallback={<Loading />}>
            <Demo />
          </Suspense>
        }
      />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
