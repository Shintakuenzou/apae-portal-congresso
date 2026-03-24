import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";

export function HeaderActions() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="hidden md:flex items-center">
      {isAuthenticated ? (
        <Button
          asChild
          size="lg"
          className="bg-linear-to-r from-[#f5a623] to-[#f08c00] text-white text-sm font-semibold px-5 py-2 shadow-lg shadow-[#f08c00]/10 hover:shadow-xl transition-shadow"
        >
          <Link to="/painel/data">
            <span>Meu Perfil</span>
          </Link>
        </Button>
      ) : (
        <Button
          asChild
          size="lg"
          className="bg-linear-to-r from-[#f5a623] to-[#f08c00] text-white text-sm font-semibold px-5 py-2 shadow-lg shadow-[#f08c00]/10 hover:shadow-xl transition-shadow"
        >
          <Link to="/login">
            <span>Acessar Perfil</span>
          </Link>
        </Button>
      )}
    </div>
  );
}
