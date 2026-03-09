import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { ArrowLeft, Mail, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import BgLogin from "../../public/login-bg.png";
import { formatCPF } from "@/utils/format-cpf";

export const Route = createFileRoute("/recuperar-senha")({
  component: RedefinirSenhaPage,
});

function RedefinirSenhaPage() {
  const [step, setStep] = useState<"email" | "sent" | "reset" | "success">("email");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [passwords, setPasswords] = useState({
    nova: "",
    confirmar: "",
  });
  const [error, setError] = useState("");

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsLoading(false);
    setStep("sent");
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (passwords.nova.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    if (passwords.nova !== passwords.confirmar) {
      setError("As senhas nao coincidem");
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setStep("success");
  };

  return (
    <div className="min-h-screen flex">
      {/* Lado esquerdo - Visual */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative bg-violet-950">
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url(${BgLogin})` }} />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <Link to="/login" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors w-fit">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Voltar ao login</span>
          </Link>

          <div className="space-y-6">
            <h2 className="text-4xl xl:text-5xl font-bold leading-tight text-balance">Recupere seu acesso de forma segura</h2>
            <p className="text-lg text-white/90 max-w-md">Enviaremos um link para o email cadastrado. Siga as instrucoes para criar uma nova senha e voltar a acessar sua conta.</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Suporte</p>
                <p className="text-sm text-white/80">suport.ti@apaebrasil.org.br</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lado direito - Formulario */}
      <div className="w-full lg:w-1/2 xl:w-2/5 flex flex-col bg-background">
        {/* Header mobile */}
        <header className="p-6 lg:hidden">
          <Link to="/login" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Voltar ao login</span>
          </Link>
        </header>

        {/* Conteudo centralizado */}
        <main className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md space-y-8">
            {/* Step 1: Solicitar email */}
            {step === "email" && (
              <>
                <div className="text-center space-y-3">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-violet-600/10 text-violet-600">
                    <Mail className="h-7 w-7" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">Esqueceu sua senha?</h1>
                    <p className="text-muted-foreground mt-1">Informe seu CPF e email cadastrado para recuperar o acesso</p>
                  </div>
                </div>

                <form onSubmit={handleSendEmail} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="cpf" className="text-sm font-medium">
                      CPF
                    </Label>
                    <Input
                      id="cpf"
                      type="text"
                      placeholder="000.000.000-00"
                      value={cpf}
                      onChange={(e) => setCpf(formatCPF(e.target.value))}
                      maxLength={14}
                      required
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email cadastrado
                    </Label>
                    <Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-12" />
                  </div>

                  <Button type="submit" className="w-full h-12 bg-violet-600 hover:bg-violet-600/90 text-white font-semibold" disabled={isLoading}>
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Enviando...
                      </span>
                    ) : (
                      "Enviar link de recuperacao"
                    )}
                  </Button>
                </form>

                <p className="text-center text-sm text-muted-foreground">
                  Lembrou a senha?{" "}
                  <Link to="/login" className="text-violet-600 font-medium hover:underline">
                    Voltar ao login
                  </Link>
                </p>
              </>
            )}

            {/* Step 2: Email enviado */}
            {step === "sent" && (
              <div className="text-center space-y-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-violet-600/10 text-violet-600">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold text-foreground">Email enviado!</h1>
                  <p className="text-muted-foreground">
                    Enviamos um link de recuperacao para <span className="font-medium text-foreground">{email}</span>
                  </p>
                </div>

                <div className="bg-muted/50 rounded-xl p-4 text-left space-y-3">
                  <p className="text-sm text-muted-foreground">Verifique sua caixa de entrada e spam. O link expira em 30 minutos.</p>
                </div>

                <div className="space-y-3">
                  <Button onClick={() => setStep("reset")} className="w-full h-12 bg-violet-600 hover:bg-violet-600/90 text-white font-semibold">
                    Ja tenho o codigo
                  </Button>
                  <Button variant="outline" onClick={() => setStep("email")} className="w-full h-12">
                    Reenviar email
                  </Button>
                </div>

                <p className="text-center text-sm text-muted-foreground">
                  <Link to="/login" className="text-violet-600 font-medium hover:underline">
                    Voltar ao login
                  </Link>
                </p>
              </div>
            )}

            {/* Step 3: Nova senha */}
            {step === "reset" && (
              <>
                <div className="text-center space-y-3">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-violet-600/10 text-violet-600">
                    <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">Crie uma nova senha</h1>
                    <p className="text-muted-foreground mt-1">Sua nova senha deve ter pelo menos 6 caracteres</p>
                  </div>
                </div>

                <form onSubmit={handleResetPassword} className="space-y-5">
                  {error && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      {error}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="nova" className="text-sm font-medium">
                      Nova senha
                    </Label>
                    <Input
                      id="nova"
                      type="password"
                      placeholder="Minimo 6 caracteres"
                      value={passwords.nova}
                      onChange={(e) => setPasswords({ ...passwords, nova: e.target.value })}
                      required
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmar" className="text-sm font-medium">
                      Confirmar nova senha
                    </Label>
                    <Input
                      id="confirmar"
                      type="password"
                      placeholder="Digite novamente"
                      value={passwords.confirmar}
                      onChange={(e) => setPasswords({ ...passwords, confirmar: e.target.value })}
                      required
                      className="h-12"
                    />
                  </div>

                  <Button type="submit" className="w-full h-12 bg-violet-600 hover:bg-violet-600/90 text-white font-semibold" disabled={isLoading}>
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Salvando...
                      </span>
                    ) : (
                      "Redefinir senha"
                    )}
                  </Button>
                </form>

                <p className="text-center text-sm text-muted-foreground">
                  <Link to="/login" className="text-violet-600 font-medium hover:underline">
                    Voltar ao login
                  </Link>
                </p>
              </>
            )}

            {/* Step 4: Sucesso */}
            {step === "success" && (
              <div className="text-center space-y-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-violet-600/10 text-violet-600">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold text-foreground">Senha redefinida!</h1>
                  <p className="text-muted-foreground">Sua senha foi alterada com sucesso. Agora voce pode acessar sua conta com a nova senha.</p>
                </div>

                <Link to="/login">
                  <Button className="w-full h-12 bg-violet-600 hover:bg-violet-600/90 text-white font-semibold">Ir para o login</Button>
                </Link>
              </div>
            )}
          </div>
        </main>

        {/* <div className="p-6 text-center text-sm text-muted-foreground">
          <p>
            Precisa de ajuda?
            <Link to="mailto:contato@apaebrasil.org.br" className="text-secondary hover:underline">
              Entre em contato
            </Link>
          </p>
        </div> */}
      </div>
    </div>
  );
}
