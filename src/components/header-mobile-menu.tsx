/**
 * @module components/header-mobile-menu
 * @description Menu de navegação mobile — exibido apenas em telas < md.
 */
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { NAV_ITEMS } from "@/constants/navigation";

interface HeaderMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HeaderMobileMenu({ isOpen, onClose }: HeaderMobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="md:hidden bg-violet-950 border-t border-violet-600/10 shadow-xl">
      <div className="px-4 py-6 space-y-2">
        {NAV_ITEMS.map((item) => {
          return (
            <Link
              key={item.to}
              to={item.to}
              className="block px-4 py-3 rounded-lg text-sm font-medium transition-all text-white"
              onClick={onClose}
              activeProps={{
                className: "bg-red-500/20 font-bold",
              }}
              activeOptions={{
                exact: true,
              }}
            >
              {item.label}
            </Link>
          );
        })}
        <div className="pt-4">
          <Button asChild size="lg" className="w-full bg-violet-700 hover:bg-violet-700/90 text-white font-semibold">
            <Link to="/inscricao" onClick={onClose}>
              Inscreva-se
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
