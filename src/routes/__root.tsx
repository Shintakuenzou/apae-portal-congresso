import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { type AuthContextType } from "@/types/auth-context-type";

interface RouterContext {
  auth: AuthContextType;
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
