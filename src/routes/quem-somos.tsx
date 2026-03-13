import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Building, Calendar, Globe } from "lucide-react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import { useAuth } from "@/context/auth-context";

export const Route = createFileRoute("/quem-somos")({
  head: () => ({
    meta: [
      { title: "Sobre nós | APAE BRASIL" },
      {
        name: "description",
        content:
          "A Federação Nacional das Apaes, ou Apae Brasil, é a maior rede de defesa e garantia de direitos das pessoas com deficiência intelectual e deficiência múltipla da América Latina.",
      },
      {
        name: "keywords",
        content: "APAE, APAE BRASIL, deficiência intelectual, deficiência múltipla, inclusão social, educação, saúde, direitos",
      },
      {
        property: "og:title",
        content: "Sobre nós | APAE BRASIL",
      },
      {
        property: "og:description",
        content:
          "A Federação Nacional das Apaes, ou Apae Brasil, é a maior rede de defesa e garantia de direitos das pessoas com deficiência intelectual e deficiência múltipla da América Latina.",
      },
      {
        property: "og:type",
        content: "website",
      },
    ],
  }),
  component: QuemSomosPage,
});

const stats = [
  { value: "2.000+", label: "APAEs no Brasil", icon: Building },
  { value: "250.000+", label: "Pessoas atendidas", icon: Users },
  { value: "60+", label: "Anos de historia", icon: Calendar },
  { value: "27", label: "Estados representados", icon: Globe },
];

const fundamentos: { icon: IconName; title: string; description: string }[] = [
  {
    icon: "eye",
    title: "Transparência nas operações",
    description:
      "A Apae sempre manteve uma política de transparência em suas operações financeiras e administrativas, garantindo que doadores, parceiros e a comunidade em geral possam ter visibilidade e entendimento claro sobre como os recursos são utilizados.",
  },
  {
    icon: "target",
    title: "Impacto comprovado",
    description:
      "Os programas e serviços oferecidos pela Apae têm resultados mensuráveis, que demonstram impacto positivo na vida das pessoas atendidas. Isso inclui melhorias na educação, saúde, inclusão social e empregabilidade, entre outras áreas.",
  },
  {
    icon: "hand-heart",
    title: "Engajamento com a comunidade",
    description:
      "A Apae trabalha em estreita colaboração com as comunidades locais, promovendo a inclusão de pessoas com deficiência em todas as esferas da vida social. Esse engajamento ajuda a fortalecer laços comunitários e promove uma maior conscientização sobre as questões da deficiência.",
  },
  {
    icon: "scale",
    title: "Advocacia e luta por direitos",
    description:
      "A organização não apenas presta serviços diretos, mas também atua fortemente na advocacia pelos direitos das pessoas com deficiência, trabalhando para influenciar políticas públicas e legislações que favoreçam essa parcela da população.",
  },
];

const timeline = [
  {
    year: "1954",
    title: "Fundação da primeira APAE",
    description: "A primeira APAE foi fundada no Rio de Janeiro, iniciando o movimento apaeano no Brasil.",
  },
  {
    year: "1962",
    title: "Criação da Fenapaes",
    description: "A Federação Nacional das APAEs foi criada para coordenar e fortalecer o movimento em todo o país.",
  },
  {
    year: "1988",
    title: "Constituição Federal",
    description: "A nova Constituição brasileira reconhece os direitos das pessoas com deficiência.",
  },
  {
    year: "2015",
    title: "Lei Brasileira de Inclusão",
    description: "Marco histórico na garantia dos direitos das pessoas com deficiência no Brasil.",
  },
  {
    year: "2026",
    title: "Congresso Nacional",
    description: "O maior evento do movimento apaeano reunirá milhares de participantes em Brasília.",
  },
];

function QuemSomosPage() {
  const { isAuthenticated } = useAuth();

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-violet-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 text-balance">Quem Somos</h1>
            <p className="text-lg text-white/90 leading-relaxed">
              A Federação Nacional das Apaes, ou Apae Brasil, é a maior rede de defesa e garantia de direitos das pessoas com deficiência intelectual e deficiência múltipla da
              América Latina.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-background border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center py-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-violet-600/10 rounded-xl mb-3">
                  <stat.icon className="h-6 w-6 text-violet-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Introdução e Contexto */}
      <section className="py-16 bg-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none space-y-5">
            <h4 className="text-center font-bold text-2xl">APAE BRASIL</h4>

            <p className="text-muted-foreground leading-relaxed mb-6 text-justify">
              De acordo com o Censo IBGE 2010, o Brasil tem 45.606.048 de pessoas com deficiência, o que equivale a 23,9% da população do país. Segundo a pesquisa, 18,60% foram
              declaradas pessoas com deficiência visual, 7% com deficiência motora, 5,10% com deficiência auditiva e 1,40% com deficiência mental.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6 text-justify">
              O movimento apaeano foi fundado por um grupo pioneiro de pais e profissionais dedicados, motivados pela urgência de promover a desinstitucionalização e garantir o
              direito à educação e à vida comunitária para pessoas com deficiência intelectual. Esse movimento emergiu no Brasil, um país onde, historicamente, a rejeição, a
              discriminação e o preconceito eram enfrentados cotidianamente por essas pessoas e suas famílias. Em resposta a esses desafios, as primeiras associações foram criadas
              com o intuito de oferecer educação, atendimento na área de saúde e lutar pela inclusão social desses indivíduos.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6 text-justify">
              Essas associações, que se tornaram conhecidas como Associações de Pais e Amigos dos Excepcionais (Apaes), formaram uma rede que se dedicava não apenas à educação e ao
              atendimento de saúde, mas também à luta contínua pelos direitos das pessoas com deficiência. Esse compromisso incluiu a mobilização de diversos profissionais que,
              acreditando na causa, realizaram estudos e pesquisas, buscaram informações em entidades estrangeiras e trocaram experiências com pessoas de outras nacionalidades que
              enfrentavam desafios similares.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6 text-justify">
              O movimento apaeano, fundamentado na Declaração dos Direitos Humanos, iniciou uma significativa prestação de serviços em educação, saúde e assistência social para
              aqueles que necessitavam, em toda a extensão do território nacional. Em 2022, a rede apaeana alcançou o impressionante número de 23.035.726 atendimentos nas áreas de
              prevenção e saúde, educação, assistência social e inclusão no mercado de trabalho, atendendo mais de 1,6 milhão de pessoas em mais de 2.255 unidades espalhadas por
              todo o Brasil.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              A iniciativa dessas famílias em fundar as Apaes e a expansão desse movimento pelo Brasil deram origem ao que hoje conhecemos como movimento apaeano, uma força
              significativa na promoção e defesa dos direitos das pessoas com deficiência intelectual e múltipla.
            </p>
          </div>
        </div>
      </section>

      {/* Accordion Section - Estrutura Organizacional */}
      <section className="py-16 bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8 text-center">Estrutura do Movimento Apaeano</h2>

          <Accordion type="single" collapsible className="w-full space-y-5">
            <AccordionItem value="movimento" className="bg-card border border-border rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold text-foreground hover:no-underline cursor-pointer">Movimento Apaeano</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                <p>
                  O movimento apaeano é uma grande rede constituída por pais, amigos, pessoas com deficiência, voluntários, profissionais e instituições parceiras – públicas e
                  privadas – unidas para a promoção e defesa dos direitos de cidadania da pessoa com deficiência e a sua inclusão social.
                </p>
                <p className="mt-4">
                  Atualmente, o movimento congrega a Federação Nacional das Apaes (Apae Brasil), 26 Federações das Apaes de Estado (Feapaes) e mais de duas mil e duzentas Apaes,
                  distribuídas em todo o território brasileiro, propiciando atenção integral a mais de 1,6 milhão de pessoas com deficiência intelectual e múltipla. É o maior
                  movimento social do Brasil e da América Latina na sua área de atuação.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="fenapaes" className="bg-card border border-border rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold text-foreground hover:no-underline cursor-pointer">Federação Nacional das Apaes (Apae Brasil)</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                <p>
                  A Federação Nacional das Apaes, ou Apae Brasil, é uma organização social sem fins lucrativos, reconhecida como de utilidade pública federal e certificada como
                  beneficente de assistência social, de caráter cultural, assistencial e educacional, que congrega como filiadas atualmente mais de 2.200 Apaes e entidades filiadas
                  e 26 Federações Estaduais, que compõem o movimento apaeano, tendo como missão institucional promover e articular ações de defesa dos direitos das pessoas com
                  deficiência e representar o movimento perante os organismos nacionais e internacionais, para a melhoria da qualidade dos serviços prestados pelas Apaes, na
                  perspectiva da inclusão social de seus usuários.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="feapaes" className="bg-card border border-border rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold text-foreground hover:no-underline cursor-pointer">Federação das Apaes do Estado (Feapaes)</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                <p>
                  A Federação das Apaes do Estado é uma associação civil, beneficente de assistência social, de assessoramento, de defesa e garantia de direitos com foco no
                  fortalecimento do movimento social da pessoa com deficiência, formação e capacitação de lideranças, defesa, efetivação e construção de novos direitos, promoção da
                  cidadania, enfrentamento das desigualdades sociais, articulação com órgãos públicos de defesa de direitos, dirigidos ao público da política de assistência social,
                  nas áreas da educação, saúde, esporte, cultura, formação do trabalho, estudo e pesquisa, sem fins lucrativos e de fins não econômicos, com duração indeterminada
                  com a missão de promover e articular ações de defesa dos direitos das pessoas com deficiência e representar o movimento perante os organismos estaduais, para a
                  melhoria da qualidade dos serviços prestados pelas Apaes, na perspectiva da inclusão social de seus usuários.
                </p>
                <p className="mt-4">
                  As Apaes e outras entidades análogas serão consideradas filiadas à Federação das Apaes de seu Estado após sua filiação à Federação Nacional das Apaes.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="apae" className="bg-card border border-border rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold text-foreground hover:no-underline cursor-pointer">Apae</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                <p>
                  A Apae (Associação de Pais e Amigos dos Excepcionais) nasceu em 1954, na cidade do Rio de Janeiro. Caracteriza-se por ser uma organização social, cujo objetivo
                  principal é promover a atenção integral à pessoa com deficiência, prioritariamente aquela com deficiência intelectual e múltipla.
                </p>
                <p className="mt-4">
                  A Rede Apae destaca-se por seu pioneirismo e capilaridade, estando presente, atualmente, em mais de 2.200 mil municípios em todo o território nacional.
                </p>
                <p className="mt-4">
                  A Apae tem sido reconhecida ao longo dos anos como uma das instituições mais confiáveis do Brasil, conforme demonstrado pelos múltiplos prêmios de "Marca de
                  Confiança" recebidos da Revista Seleções. Este prestigioso reconhecimento é um testemunho do comprometimento contínuo da Apae em promover uma vida de qualidade
                  para pessoas com deficiência intelectual e múltipla, e reflete a excelente reputação que a organização construiu ao longo de décadas de trabalho dedicado.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Fundamentos da Confiança */}
      <section className="py-16 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">Fundamentos da Confiança</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">A confiança que a Apae construiu junto ao público brasileiro se baseia em diversos pilares fundamentais</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {fundamentos.map((item, index) => (
              <Card key={index} className="border-border hover:border-violet-600/30 transition-colors">
                <CardContent className="p-6">
                  <div className="w-full flex items-center justify-center">
                    <DynamicIcon name={item.icon} className="h-6 w-6 text-violet-600 bg-violet-600/10 rounded-lg mb-4" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-3 text-center">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed text-justify">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Reconhecimento */}
      <section className="py-16 bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">Reconhecimento da Revista Seleções</h2>
          </div>

          <div className="prose prose-lg max-w-none text-center">
            <p className="text-muted-foreground leading-relaxed mb-6">
              O prêmio de "Marca de Confiança", da Revista Seleções, é concedido anualmente a marcas em diversas categorias, com base em pesquisas de opinião pública que medem a
              percepção de confiança que os consumidores têm nas empresas e instituições. Para a Apae, receber este prêmio, repetidas vezes, reforça o reconhecimento do trabalho
              sério e comprometido que a organização realiza.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              A premiação também ressalta a responsabilidade que a Apae carrega em manter e superar as expectativas do público a cada ano. Cada reconhecimento recebido pela Apae
              não apenas valida o trabalho já realizado, mas também impulsiona a organização a continuar inovando e melhorando seus programas e suas abordagens.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Os prêmios de "Marca de Confiança" que a Apae acumulou ao longo dos anos são muito mais do que meros troféus em uma estante. Eles são um reflexo do impacto profundo e
              duradouro que a organização teve na sociedade brasileira, e um lembrete do trabalho contínuo que ainda precisa ser feito para garantir que todas as pessoas,
              independentemente de suas capacidades, possam viver com dignidade e plenitude. A Apae, com o seu histórico de confiança e eficácia, permanece na vanguarda desse
              esforço, moldando um futuro mais inclusivo para todos.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 bg-background">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">Nossa Trajetória</h2>
            <p className="text-muted-foreground">Mais de 70 anos de luta pela inclusão e pelos direitos das pessoas com deficiência</p>
          </div>

          <div className="relative">
            {/* Linha central vertical */}
            <div className="absolute left-4 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-border" />

            <div className="space-y-8">
              {timeline.map((item, index) => (
                <div key={index} className={`relative flex items-start gap-6 md:gap-0 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  {/* Conteudo */}
                  <div className={`flex-1 ml-10 md:ml-0 ${index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12 md:text-left"}`}>
                    <div
                      className={`inline-block bg-card border border-border rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow ${index % 2 === 0 ? "md:mr-0" : "md:ml-0"}`}
                    >
                      <span className="inline-block text-sm font-bold text-violet-600 mb-1">{item.year}</span>
                      <h3 className="text-base font-semibold text-foreground mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>

                  {/* Ponto central */}
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-3 h-3 bg-violet-600 rounded-full border-2 border-background shadow z-10 mt-6" />

                  {/* Linha horizontal conectando ao ponto */}
                  <div className={`hidden md:block absolute top-7 w-8 h-0.5 bg-border ${index % 2 === 0 ? "left-1/2 ml-1.5" : "right-1/2 mr-1.5"}`} />

                  {/* Espaco vazio do outro lado */}
                  <div className="hidden md:block flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-violet-950">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Faça Parte Dessa História</h2>
          <p className="text-white/80 mb-8 leading-relaxed">
            O Congresso Nacional APAE Brasil 2026 constitui o principal evento do movimento apaeano, congregando profissionais, familiares, pesquisadores e pessoas com deficiência
            de todo o país.
          </p>
          <Button asChild size="lg" className="bg-amber-400 hover:bg-amber-400/90 text-violet-950 font-semibold hover:text-violet-950 border-none">
            <Link to={isAuthenticated ? "/painel" : "/login"}>Inscreva-se Agora</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </main>
  );
}
