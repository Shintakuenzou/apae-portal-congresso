/**
 * @module components/purchase-step
 * @description Página de sucesso pós-inscrição com tutorial de compra de ingresso.
 */
import { motion } from "framer-motion";
import { LogIn, ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SuccessHeader } from "@/components/success-header";
import { Header } from "./header";
import { Footer } from "./footer";
import { DynamicIcon } from "lucide-react/dynamic";
import { Link } from "@tanstack/react-router";
import { STEPS } from "@/constants";

export function PurchaseStep() {
  return (
    <div>
      <Header />

      <main className="mx-auto max-w-3xl px-4 py-40 md:px-6">
        <div className="space-y-10">
          <SuccessHeader
            title="Inscricao Confirmada!"
            subtitle="Sua inscricao foi realizada com sucesso. Agora siga os passos abaixo para garantir seu ingresso."
            email="joao.silva@email.com"
          />

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-foreground">Como comprar seu ingresso</h2>
              <p className="mt-2 text-muted-foreground">Siga o passo a passo abaixo para finalizar sua compra</p>
            </div>

            {/* Steps Timeline */}
            <div className="relative mt-10">
              {/* Vertical Line */}
              <div className="absolute left-6 top-0 bottom-0 w-px bg-border md:left-1/2 md:-translate-x-px" />

              <div className="space-y-8">
                {STEPS.map((step, index) => (
                  <motion.div
                    key={step.number}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.15 }}
                    className={`relative flex items-start gap-6 md:gap-12 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                  >
                    {/* Step Number Circle */}
                    <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 z-10">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-accent bg-background text-accent font-bold text-lg">
                        {step.number}
                      </div>
                    </div>

                    {/* Content Card */}
                    <div className={`ml-20 flex-1 md:ml-0 ${index % 2 === 0 ? "md:pr-16 md:text-right" : "md:pl-16"}`}>
                      <div className="rounded-xl border border-border bg-card p-6 transition-all hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5">
                        <div className={`flex items-center gap-3 ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                            <DynamicIcon name={step.icon} className="h-5 w-5" color="green" />
                          </div>
                          <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                        </div>
                        <p className={`mt-3 text-sm text-muted-foreground leading-relaxed ${index % 2 === 0 ? "md:text-right" : ""}`}>{step.description}</p>
                      </div>
                    </div>

                    {/* Empty space for alternating layout */}
                    <div className="hidden flex-1 md:block" />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="mt-12 flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-8 text-center"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
                <LogIn className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Pronto para comecar?</h3>
              <p className="max-w-md text-muted-foreground">Faca login agora e garanta seu ingresso para o evento. Nao perca essa oportunidade!</p>
              <Button className="mt-2 bg-accent text-accent-foreground hover:bg-accent/90" size="lg" asChild>
                <Link to="/login">
                  Fazer Login
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>

            {/* Help Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
              className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground"
            >
              <Mail className="h-4 w-4" />
              <span>Duvidas? Entre em contato:</span>
              <a href="mailto:suporte.ti@apaebrasil.org.br" className="font-medium hover:underline">
                suporte.ti@apaebrasil.org.br
              </a>
            </motion.div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
