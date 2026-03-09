import { AlertCircle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="mx-auto max-w-md text-center">
        {/* Icon */}
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-purple-100">
          <AlertCircle className="h-12 w-12 text-purple-600" />
        </div>

        {/* Error Code */}
        <h1 className="text-7xl font-bold tracking-tight text-purple-900">404</h1>

        {/* Title */}
        <h2 className="mt-4 text-2xl font-semibold text-purple-800">Página não encontrada</h2>

        {/* Description */}
        <p className="mt-4 text-pretty leading-relaxed text-purple-600">Desculpe, a página que você está procurando não existe ou foi movida para outro endereço.</p>

        {/* Actions */}
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild className="bg-purple-600 text-purple-50 hover:bg-purple-700">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Voltar ao início
            </Link>
          </Button>
        </div>

        {/* Help Text */}
        <p className="mt-8 text-sm text-purple-500">Se você acredita que isso é um erro, entre em contato com nosso suporte.</p>
      </div>
    </div>
  );
}
