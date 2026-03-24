import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { FeaturedSchedule } from "@/components/featured-schedule";
import { CTASection } from "@/components/cta-section";
import { Footer } from "@/components/footer";
import { SpeakersCommitteeSection } from "@/components/speakers-section";
import { GallerySection } from "@/components/galery";
import { SponsorsSection } from "@/components/sponsor-section";
import { type ActivityFields, type EventoFields } from "@/services/form-service";
import { fetchDataset } from "@/services/fetch-dataset";
import type { CommitteeFields, PalestranteFields, ParticipantsFields } from "@/types/entities.types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Home | APAE BRASIL" },
      {
        name: "description",
        content: "Home do Congresso Nacional APAE Brasil 2026.",
      },
      {
        name: "keywords",
        content: "APAE, APAE BRASIL, congresso",
      },
      {
        property: "og:title",
        content: "Home | APAE BRASIL",
      },
      {
        property: "og:description",
        content: "Home do Congresso Nacional APAE Brasil 2026.",
      },
      {
        property: "og:type",
        content: "website",
      },
    ],
  }),
  loader: async () => {
    const responseEvent = await fetchDataset<EventoFields>({ datasetId: import.meta.env.VITE_DATASET_EVENTO as string });
    const responseActivities = await fetchDataset<ActivityFields>({ datasetId: import.meta.env.VITE_DATASET_PARTICIPANTE as string });
    const responseParticipants = await fetchDataset<ParticipantsFields>({ datasetId: import.meta.env.VITE_DATASET_PARTICIPANTE as string });
    const responsePalestrantes = await fetchDataset<PalestranteFields>({ datasetId: import.meta.env.VITE_DATASET_PALESTRANTE as string });
    const responseComissaoCientifica = await fetchDataset<CommitteeFields>({ datasetId: import.meta.env.VITE_DATASET_COMISSAO_CIENTIFICA as string });
    return { responseEvent, responseActivities, responseParticipants, responsePalestrantes, responseComissaoCientifica };
  },
  component: App,
});

function App() {
  const { responseEvent, responseActivities, responseParticipants, responsePalestrantes, responseComissaoCientifica } = Route.useLoaderData();
  console.log(responseEvent);

  return (
    <main className="min-h-screen">
      <Header />
      <Hero event={responseEvent} activeEvent={responseActivities} participants={responseParticipants} />
      <SponsorsSection />
      <SpeakersCommitteeSection spearkers={responsePalestrantes.items} title="Palestrantes" description="Conheça nossos palestrantes" badgeCategory="Palestrantes" />
      <FeaturedSchedule />
      <SpeakersCommitteeSection
        committeMembers={responseComissaoCientifica.items}
        title="Comitê Científico"
        description="Conheça nosso comitê científico"
        badgeCategory="Comitê Científico"
      />
      <GallerySection />
      <CTASection />
      <Footer />
    </main>
  );
}
