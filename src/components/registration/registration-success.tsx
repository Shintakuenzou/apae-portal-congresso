import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface RegistrationSuccessProps {
  onReset: () => void;
}

export function RegistrationSuccess({ onReset }: RegistrationSuccessProps) {
  return (
    <section id="inscricao" className="py-20 bg-violet-950 text-white">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        <CheckCircle className="h-20 w-20 text-violet-400 mx-auto mb-6" />
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Inscrição Realizada!</h2>
        <p className="text-lg text-white/80 mb-8">Obrigado por se inscrever no Congresso Nacional APAE Brasil 2026. Em breve você receberá um e-mail com mais informações.</p>
        <Button onClick={onReset} variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:text-white bg-transparent">
          Fazer nova inscrição
        </Button>
      </div>
    </section>
  );
}
