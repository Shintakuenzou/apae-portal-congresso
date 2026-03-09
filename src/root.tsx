// src/components/app.tsx
import { RouterProvider, createRouter } from "@tanstack/react-router";

import { routeTree } from "@/routeTree.gen";
import { useAuth, type AuthContextType } from "./context/auth-context";

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    auth: undefined! as AuthContextType,
  },
  defaultPreload: "intent",
  scrollRestoration: true,
  basepath: "/",
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export function App() {
  const auth = useAuth();

  return <RouterProvider router={router} context={{ auth }} />;
}
