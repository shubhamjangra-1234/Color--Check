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
const Try = lazy(() => import("./Components/Home/Try")); // Import Try component
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
        path="try"
        element={
          <Suspense fallback={<Loading />}>
            <Try />
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
