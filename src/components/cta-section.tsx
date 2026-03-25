import { Button } from "@/components/ui/button";
import type { LoteFields } from "@/types";
import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle } from "lucide-react";
import { useMemo } from "react";

const benefits = ["Acesso completo a todas as palestras", "Material exclusivo do evento", "Certificado de participação", "Networking com profissionais"];

interface CTASectionProps {
  lote: LoteFields[];
}

export function CTASection({ lote }: CTASectionProps) {
  const activeLot = useMemo(() => {
    return lote.filter((lot) => lot.status === "ATIVO" && lot.tipo_lote == "PORTAL");
  }, [lote]);

  return (
    <section className="relative bg-linear-to-br from-[#2a1050] via-[#3d1c6e] to-[#12003a] py-20 overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-[#c4a8f0]/10 blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-[#fdf8f2]/5 blur-3xl pointer-events-none"></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Garanta sua Vaga no Maior Evento do Movimento Apaeano</h2>
            <p className="text-lg text-white/95 mb-8">
              Inscrições com desconto de 30% ate 30 de Junho de 2026. Não perca essa oportunidade única de fazer parte dessa transformação.
            </p>

            <ul className="space-y-3 mb-10">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-3 text-white/85">
                  <CheckCircle className="h-5 w-5 text-violet-400" />
                  <span className="text-white/95 font-medium">{benefit}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Button
                asChild
                className="flex items-center gap-2 bg-linear-to-r from-[#f5a623] to-[#f08c00] w-[250px] text-white font-extrabold text-base justify-center p-7 rounded-full shadow-xl shadow-[#f5a623]/20 hover:-translate-y-0.5 transition-transform"
              >
                <Link to="/login">
                  Inscreva-se agora
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
            <div className="text-center">
              <div className="text-sm text-amber-400 mb-2">Investimento</div>
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className="text-5xl font-bold text-white">{activeLot[0].preco}</span>
              </div>

              <div className="mt-8 pt-8 border-t border-white/20">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="flex flex-col items-center">
                    <div className="text-2xl font-bold text-white">3</div>
                    <div className="text-xs text-white/95 font-medium">Dias</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-2xl font-bold text-white">50+</div>
                    <div className="text-xs text-white/95 font-medium">Palestras</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-2xl font-bold text-white">100%</div>
                    <div className="text-xs text-white/95 font-medium">Acessivel</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
