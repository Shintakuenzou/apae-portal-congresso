import { Heart, Users, Target, Award } from "lucide-react";

const features = [
  {
    icon: Heart,
    title: "Inclusão",
    description: "Promovemos a inclusão social de pessoas com deficiência intelectual e múltipla em todas as esferas da sociedade.",
  },
  {
    icon: Users,
    title: "Comunidade",
    description: "Uma rede de mais de 2.000 APAEs em todo o Brasil, unidas pelo compromisso com a vida e a dignidade humana.",
  },
  {
    icon: Target,
    title: "Missão",
    description: "Defender os direitos das pessoas com deficiência e promover políticas públicas que garantam sua plena cidadania.",
  },
  {
    icon: Award,
    title: "Excelência",
    description: "Mais de 60 anos de história dedicados à educação especial, saúde e assistência social de qualidade.",
  },
];

export function About() {
  return (
    <section id="quem-somos" className="py-20 bg-muted">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">Quem Somos</h2>
            <p className="text-muted-foreground text-lg mb-6">
              A Federação Nacional das APAEs (Fenapaes) é a maior rede de promoção e defesa dos direitos das pessoas com deficiência intelectual e múltipla do Brasil.
            </p>
            <p className="text-muted-foreground mb-6">
              Fundada em 1962, a Fenapaes congrega mais de 2.000 APAEs distribuídas em todos os estados brasileiros, atendendo mais de 250 mil pessoas com deficiência e suas
              famílias.
            </p>
            <p className="text-muted-foreground">
              O Congresso Nacional APAE Brasil é o maior evento do movimento apaeano, reunindo profissionais, famílias, gestores e pessoas com deficiência para debater os avanços e
              desafios da inclusão no país.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-card p-6 rounded-lg border border-border">
                <feature.icon className="h-10 w-10 text-violet-600 mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
