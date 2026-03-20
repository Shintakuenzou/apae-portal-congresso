import NotFound from "@/components/nout-found";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/not-found")({
  head: () => ({
    meta: [{ title: "404 - Página não encontrada | APAE BRASIL" }],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return <NotFound />;
}
