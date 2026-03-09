import { useState } from "react";

import { Menu, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import LogoApae from "../../public/logo-transparente.png";

import { HeaderNav } from "./header-nav";
import { HeaderActions } from "./header-actions";
import { HeaderMobileMenu } from "./header-mobile-menu";
import { Button } from "./ui/button";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 shadow-lg border-b-2 bg-violet-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between py-3">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-full flex items-center justify-center group-hover:scale-105 transition-transform">
              <img src={LogoApae} className="size-20 object-contain p-1" alt="logo apae" />
            </div>
          </Link>

          <HeaderNav />

          <HeaderActions />

          <Button
            type="button"
            className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      <HeaderMobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </header>
  );
}
