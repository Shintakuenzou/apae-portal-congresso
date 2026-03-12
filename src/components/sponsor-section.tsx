import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { useQuery } from "@tanstack/react-query";
import { fetchDataset } from "@/services/fetch-dataset";
import { useLotes } from "@/hooks/useLotes";

const autoScrollPlugin = AutoScroll({
  speed: 1,
  stopOnInteraction: false, // continua após drag
  stopOnMouseEnter: true, // pausa no hover (a11y)
  stopOnFocusIn: true, // pausa quando um card recebe foco via teclado (a11y)
});

export function SponsorsSection() {
  // const [open, setOpen] = useState(false);
  // const [selected, setSelected] = useState<Sponsor | null>(null);
  const { formatedDataLote } = useLotes();

  const id_lote = formatedDataLote && formatedDataLote.length > 0 ? formatedDataLote[formatedDataLote.length - 1].fields.id_evento : "";

  const { data: sponsorsData } = useQuery({
    queryKey: ["sponsors", id_lote],
    queryFn: () =>
      fetchDataset({
        datasetId: "ds_buscaParceirosVinculados_CN",
        constraints: [
          {
            fieldName: "id_evento",
            initialValue: id_lote,
            finalValue: id_lote,
            constraintType: "MUST",
          },
        ],
      }),

    enabled: !!id_lote,
  });

  // Embla — loop: true habilita o loop infinito real sem duplicar itens manualmente
  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      dragFree: true,
      align: "start",
      slidesToScroll: 1,
      // Responsividade automática via breakpoints do Embla
      breakpoints: {
        "(max-width: 640px)": { slidesToScroll: 1 },
        "(min-width: 641px)": { slidesToScroll: 2 },
      },
    },
    [autoScrollPlugin],
  );

  // Para/retoma o scroll quando o modal abre/fecha
  // const autoScroll = emblaApi?.plugins()?.autoScroll;

  // const openModal = useCallback(
  //   (sponsor: Sponsor) => {
  //     autoScroll?.stop();
  //     setSelected(sponsor); // dados primeiro
  //     setOpen(true); // Radix anima a entrada
  //   },
  //   [autoScroll],
  // );

  // const closeModal = useCallback(() => {
  //   setOpen(false); // Radix roda a animação de saída completa
  //   // `selected` só limpa depois que a animação termina (bate com duration-200)
  //   setTimeout(() => {
  //     setSelected(null);
  //     autoScroll?.play();
  //   }, 200);
  // }, [autoScroll]);

  const openLink = useCallback((link: string) => {
    window.open(link, "_blank");
  }, []);

  if (!id_lote) return null;

  return (
    <section className="relative bg-violet-950 border-b border-border overflow-hidden" aria-label="Patrocinadores Oficiais">
      {/* Faixa de destaque superior */}
      <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-violet-400 to-transparent" />

      {/* Fundo pontilhado sutil */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-border" aria-hidden="true" />
          <div className="text-center shrink-0">
            <h2 className="text-xl font-bold text-white">Parceiros</h2>
          </div>
          <div className="h-px flex-1 bg-border" aria-hidden="true" />
        </div>

        <div
          ref={emblaRef}
          className="overflow-hidden"
          role="region"
          aria-label="Carrossel de patrocinadores"
          aria-roledescription="carrossel"
          style={{
            WebkitMaskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
            maskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
          }}
        >
          <div className="flex py-2">
            {sponsorsData?.items?.map((sponsor, i) => (
              <div
                key={i}
                className="embla__slide flex-shrink-0 px-2 lg:w-96 md:w-72 w-64"
                role="group"
                aria-roledescription="item"
                aria-label={`${sponsor.name} — ${sponsor.tipo}`}
              >
                <div
                  role="button"
                  tabIndex={0}
                  aria-label={`Ver detalhes de ${sponsor.nome}`}
                  onClick={() => openLink(sponsor.link_acesso as string)}
                  className={`
                    flex flex-col items-center gap-2 bg-white
                    rounded-2xl px-6 py-5 cursor-pointer select-none
                    transition-all duration-200 border
                    hover:scale-105 hover:shadow-lg active:scale-95
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-950 focus-visible:ring-offset-2
                    border-border shadow-sm 
                  `}
                  style={{ minWidth: 180 }}
                >
                  <img src={sponsor.url_foto as string} alt={sponsor.nome as string} className="w-32 h-32 object-contain rounded-2xl" />

                  <p className={`text-sm font-bold text-center leading-tight text-violet-950`}>{sponsor.nome}</p>
                  <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-violet-950 text-white`}>{sponsor.tipo}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p aria-hidden="true" className="text-center text-xs text-violet-950/40 mt-6 flex items-center justify-center gap-2">
          <span className="text-violet-950/30">✦</span>
          Confira nossos parceiros
          <span className="text-violet-950/30">✦</span>
        </p>
      </div>

      {/* Faixa inferior */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-violet-950 to-transparent" />

      {/* ── Radix Dialog Modal ──
        Benefícios vs implementação manual:
        • Focus trap automático (Tab não vaza para o fundo)
        • Fecha com Esc nativamente
        • aria-modal="true" gerenciado automaticamente
        • Foco retorna ao elemento que abriu o modal ao fechar
        • aria-labelledby e aria-describedby conectados via Dialog.Title / Dialog.Description
        • Scroll lock no body
      */}
      {/* <Dialog.Root open={open} onOpenChange={(isOpen) => !isOpen && closeModal()}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

          <Dialog.Content
            className={`
              fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
              w-full max-w-md rounded-3xl shadow-2xl overflow-hidden
              data-[state=open]:animate-in data-[state=closed]:animate-out
              data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
              data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
              duration-200
              ${selected?.bg ?? ""}
            `}
          >
            <div className={`${selected?.avatar} p-6 flex items-center gap-4`}>
              <div aria-hidden="true" className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-white font-black text-xl shadow-lg">
                {selected?.initial}
              </div>

              <div className="flex-1 min-w-0">
                <Dialog.Title className="text-white font-black text-xl leading-tight">{selected?.name}</Dialog.Title>
                <div className="flex items-center gap-1.5 mt-1.5" aria-hidden="true">
                  <Tag className="w-3 h-3 text-white/70" />
                  <span className="text-white/80 text-xs font-semibold">{selected?.category}</span>
                </div>
              </div>

              <Dialog.Close
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label="Fechar detalhes do patrocinador"
              >
                <span aria-hidden="true" className="text-white text-sm font-bold">
                  ✕
                </span>
              </Dialog.Close>
            </div>

            <div className="p-6 flex flex-col gap-5">
              <div>
                <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${selected?.text} opacity-60`} aria-hidden="true">
                  Sobre
                </p>
                <Dialog.Description className="text-foreground/80 text-sm leading-relaxed">{selected?.description}</Dialog.Description>
              </div>

              <div aria-hidden="true" className={`h-px ${selected?.ring} ring-1 ring-inset opacity-30`} />

              <div className="flex items-center gap-2">
                <Globe className={`w-4 h-4 ${selected?.text} shrink-0`} aria-hidden="true" />
                <a
                  href={selected?.site}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-sm font-medium ${selected?.text} truncate hover:underline focus-visible:outline-none focus-visible:underline`}
                  aria-label={`Site oficial de ${selected?.name} (abre em nova aba)`}
                >
                  {selected?.site.replace("https://", "")}
                </a>
              </div>

              <a
                href={selected?.site}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visitar site oficial de ${selected?.name} (abre em nova aba)`}
                className={`
                  w-full flex items-center justify-center gap-2
                  py-3 rounded-2xl text-white font-bold text-sm
                  shadow-lg hover:opacity-90 hover:scale-[1.02]
                  active:scale-[0.98] transition-all duration-200
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2
                  ${selected?.avatar}
                `}
              >
                Visitar site oficial
                <ExternalLink className="w-4 h-4" aria-hidden="true" />
              </a>

              <Dialog.Close className="w-full py-2.5 rounded-2xl text-sm font-semibold text-muted-foreground hover:bg-black/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600">
                Fechar
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root> */}
    </section>
  );
}
