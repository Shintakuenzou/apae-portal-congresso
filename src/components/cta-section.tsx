import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";

const benefits = ["Acesso completo a todas as palestras", "Material exclusivo do evento", "Certificado de participação", "Networking com profissionais"];

export function CTASection() {
  return (
    <section className="py-24 bg-violet-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Garanta sua Vaga no Maior Evento do Movimento Apaeano</h2>
            <p className="text-lg text-white/75 mb-8">
              Inscrições com desconto de 30% ate 30 de Junho de 2026. Não perca essa oportunidade única de fazer parte dessa transformação.
            </p>

            <ul className="space-y-3 mb-10">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-3 text-white/85">
                  <CheckCircle className="h-5 w-5 text-violet-400" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Button asChild size="lg" className="bg-amber-400 hover:bg-amber-400/90 text-base text-violet-950 font-semibold h-14 px-8 shadow-lg hover:shadow-xl transition-all group">
                <a href="/login">
                  Inscreva-se agora
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
            <div className="text-center">
              <div className="text-sm text-amber-400 mb-2">Investimento</div>
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className="text-white/50 line-through text-2xl">R$ 500</span>
                <span className="text-5xl font-bold text-white">R$ 350</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-violet-400/20 text-amber-400 px-4 py-1.5 rounded-full text-sm font-medium">Economia de 30%</div>

              <div className="mt-8 pt-8 border-t border-white/20">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-white">3</div>
                    <div className="text-xs text-white/60">Dias</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">50+</div>
                    <div className="text-xs text-white/60">Palestras</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">100%</div>
                    <div className="text-xs text-white/60">Acessivel</div>
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
