/**
 * @module components/header-nav
 * @description Navegação principal do header — exibida apenas em telas >= md.
 */
import { Link } from "@tanstack/react-router";
import { NAV_ITEMS } from "@/constants/navigation";

export function HeaderNav() {
  return (
    <nav className="hidden md:flex items-center gap-1">
      {NAV_ITEMS.map((item) => {
        return (
          <Link
            key={item.to}
            to={item.to}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all text-white"
            activeProps={{
              className: "bg-white/20 font-bold",
            }}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
