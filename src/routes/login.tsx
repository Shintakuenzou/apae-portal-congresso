// src/routes/login.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeOff, LogIn, ArrowLeft } from "lucide-react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";

import BgLogin from "../../public/login-bg.png";
import { formatCPF } from "@/utils/format-cpf";
import { useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { getAuthCookie } from "@/lib/cookie";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    cpf: "",
    password: "",
  });

  const { login, isAuthenticated } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/painel" });
    }
  }, [isAuthenticated, navigate]);

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    if (formatted.length <= 14) {
      setFormData({ ...formData, cpf: formatted });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const cpfLimpo = formData.cpf.replace(/\D/g, "");

      if (cpfLimpo.length !== 11) {
        setIsLoading(false);
        throw new Error("CPF inválido. Por favor, digite o CPF corretamente para continuar.");
      }

      if (!formData.password || formData.password.length < 6) {
        setIsLoading(false);
        throw new Error("Senha incorreta. Por favor, digite a senha correta para continuar.");
      }

      // ✅ Fazer login
      await login(cpfLimpo, formData.password);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("❌ Erro no login:", error.message);
        toast.error("Erro no login:", { position: "top-right" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <Toaster richColors />
      {/* Lado esquerdo - Imagem de fundo */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${BgLogin})` }} />
        <div className="absolute inset-0 bg-gradient-to-r from-violet-950/80 to-violet-950/60" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors w-fit">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Voltar ao site</span>
          </Link>

          <div className="space-y-6">
            <h2 className="text-4xl xl:text-5xl font-bold leading-tight text-balance">Juntos pela inclusão e transformação social</h2>
            <p className="text-lg text-white/90 max-w-md">
              A APAE atua há mais de 60 anos promovendo a inclusão de pessoas com deficiência intelectual e múltipla, transformando vidas e construindo uma sociedade mais justa.
            </p>
          </div>

          <div className="flex items-center gap-8">
            <div>
              <p className="text-3xl font-bold">2.200+</p>
              <p className="text-sm text-white/80">APAEs no Brasil</p>
            </div>
            <div className="w-px h-12 bg-white/30" />
            <div>
              <p className="text-3xl font-bold">250 mil+</p>
              <p className="text-sm text-white/80">Pessoas atendidas</p>
            </div>
            <div className="w-px h-12 bg-white/30" />
            <div>
              <p className="text-3xl font-bold">60+</p>
              <p className="text-sm text-white/80">Anos de história</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lado direito - Formulário */}
      <div className="w-full lg:w-1/2 xl:w-2/5 flex flex-col bg-background">
        <header className="p-6 lg:hidden">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Voltar ao site</span>
          </Link>
        </header>

        <main className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center space-y-3">
              <div className="inline-flex lg:hidden items-center justify-center w-16 h-16 rounded-2xl bg-violet-600 text-white font-bold text-xl shadow-lg">APAE</div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Acesse sua conta</h1>
                <p className="text-muted-foreground mt-1">Congresso Nacional APAE Brasil 2026</p>
              </div>
            </div>

            <Card className="border-0 shadow-xl">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="cpf" className="text-sm font-medium">
                      CPF
                    </Label>
                    <Input id="cpf" type="text" placeholder="000.000.000-00" value={formData.cpf} onChange={handleCPFChange} className="h-12 text-base" required />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-sm font-medium">
                        Senha
                      </Label>
                      <Link to="/recuperar-senha" className="text-sm text-violet-600 hover:text-violet-600/80 font-medium transition-colors">
                        Esqueceu a senha?
                      </Link>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Digite sua senha"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="h-12 text-base pr-12"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full h-12 text-base font-semibold bg-violet-600 hover:bg-violet-600/90 text-white cursor-pointer" disabled={isLoading}>
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Entrando...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <LogIn className="h-5 w-5" />
                        Entrar
                      </span>
                    )}
                  </Button>
                </form>

                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-3 text-muted-foreground">Ainda não tem conta?</span>
                  </div>
                </div>

                <Link to="/inscricao">
                  <Button
                    variant="outline"
                    className="w-full h-12 text-base font-semibold border-2 hover:bg-violet-600/10 hover:border-violet-600 hover:text-violet-600 bg-transparent cursor-pointer"
                  >
                    Faça inscrição
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
