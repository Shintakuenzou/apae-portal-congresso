import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { AuthContext } from "@/context/auth-context";

interface RouterContext {
  auth: typeof AuthContext;
}

const queryClient = new QueryClient();

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster richColors />
    </QueryClientProvider>
  ),
});
