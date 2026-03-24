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
          className="bg-linear-to-r from-[#f5a623] to-[#f08c00] text-white text-sm font-semibold px-5 py-2 rounded-full shadow-lg shadow-gold/40 hover:shadow-xl transition-shadow"
        >
          <Link to="/painel/data">
            <span>Meu Perfil</span>
          </Link>
        </Button>
      ) : (
        <Button asChild size="lg" className="bg-violet-600 hover:bg-violet-600/90 text-white font-semibold shadow-md hover:shadow-lg transition-all flex items-center">
          <Link to="/login">
            <span>Minha área</span>
          </Link>
        </Button>
      )}
    </div>
  );
}
