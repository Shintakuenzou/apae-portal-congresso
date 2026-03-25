import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import BgLogin from "/public/login-bg.png";
import { formatCPF } from "@/utils/format-cpf";
import { fetchDataset } from "@/services/fetch-dataset";
import { toast } from "sonner";

export const Route = createFileRoute("/recuperar-senha")({
  head: () => ({
    meta: [
      { title: "Recuperar Senha | APAE BRASIL" },
      {
        name: "description",
        content: "Recuperar senha no Congresso Nacional APAE Brasil 2026.",
      },
      {
        name: "keywords",
        content: "APAE, APAE BRASIL, recuperar senha, congresso",
      },
      {
        property: "og:title",
        content: "Recuperar Senha | APAE BRASIL",
      },
      {
        property: "og:description",
        content: "Recuperar senha no Congresso Nacional APAE Brasil 2026.",
      },
      {
        property: "og:type",
        content: "website",
      },
    ],
  }),
  component: RedefinirSenhaPage,
});

function RedefinirSenhaPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleForgotPassword(cpf: string, email: string) {
    setIsLoading(true);
    try {
      const responseMail = await fetchDataset<{ STATUS: string }>({
        datasetId: import.meta.env.VITE_DATASET_RECUPERA_SENHA_PORTAL as string,
        constraints: [
          {
            fieldName: "email",
            initialValue: email,
            finalValue: email,
            constraintType: "MUST",
          },
          {
            fieldName: "cpf",
            initialValue: cpf,
            finalValue: cpf,
            constraintType: "MUST",
          },
        ],
      });

      if (responseMail.items.length == 0) {
        toast.error("Os campos Email ou CPF não foram preenchidos.");
        return;
      }

      if (responseMail.items[0].STATUS == "OK") {
        setIsSuccess(true);
      }
    } catch (error) {
      console.log(error);
      toast.error("Erro ao recuperar senha");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative bg-violet-950">
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url(${BgLogin})` }} />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <Link to="/login" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors w-fit">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Voltar ao login</span>
          </Link>

          <div className="space-y-6">
            <h2 className="text-4xl xl:text-5xl font-bold leading-tight text-balance">Recupere seu acesso de forma segura</h2>
            <p className="text-lg text-white/90 max-w-lg">
              Informe seu CPF e email cadastrado para recuperar o acesso para que o nosso suporte possa redefinir sua senha e entrar em contato com você com segurança.
            </p>
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

      <div className="w-full lg:w-1/2 xl:w-2/5 flex flex-col bg-background">
        <header className="p-6 lg:hidden">
          <Link to="/login" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Voltar ao login</span>
          </Link>
        </header>

        <main className="flex-1 flex items-center justify-center p-6 lg:p-12">
          {isSuccess ? (
            <div className="w-full max-w-md space-y-8 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-emerald-100 text-emerald-600 mb-2">
                <CheckCircle className="h-12 w-12" />
              </div>

              <div className="space-y-4">
                <h1 className="text-3xl font-bold text-foreground">Solicitação Enviada!</h1>
                <p className="text-muted-foreground text-lg leading-relaxed px-4">
                  Sua solicitação de recuperação de senha foi recebida.
                  <br />
                  <br />
                  Por favor, <strong>aguarde o contato do suporte técnico</strong> para a redefinição da sua senha.
                </p>
              </div>

              <div className="w-full pt-6">
                <Link to="/login" className="w-full">
                  <Button variant="outline" className="w-full h-12 text-base font-medium">
                    Voltar ao login
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-300">
              <div className="text-center space-y-3">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-violet-600/10 text-violet-600">
                  <Mail className="h-7 w-7" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Esqueceu sua senha?</h1>
                  <p className="text-muted-foreground mt-1">Informe seu CPF e email cadastrado para recuperar o acesso</p>
                </div>
              </div>

              <form
                className="space-y-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleForgotPassword(cpf, email);
                }}
              >
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
                    "Enviar solicitação"
                  )}
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground">
                Lembrou a senha?{" "}
                <Link to="/login" className="text-violet-600 font-medium hover:underline">
                  Voltar ao login
                </Link>
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
