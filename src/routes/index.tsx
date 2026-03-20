import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { FeaturedSchedule } from "@/components/featured-schedule";
import { CTASection } from "@/components/cta-section";
import { Footer } from "@/components/footer";
import { SpeakersSection } from "@/components/speakers-section";
import { GallerySection } from "@/components/galery";
import { SponsorsSection } from "@/components/sponsor-section";
import { type ActivityFields, type EventoFields } from "@/services/form-service";
import { fetchDataset } from "@/services/fetch-dataset";
import type { ParticipantsFields } from "@/types/entities.types";

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
    const responseEvent = await fetchDataset<EventoFields>({ datasetId: import.meta.env.VITE_FORM_EVENTO as string });
    const responseActivities = await fetchDataset<ActivityFields>({ datasetId: import.meta.env.VITE_DATASET_PARTICIPANTE as string });
    const responseParticipants = await fetchDataset<ParticipantsFields>({ datasetId: import.meta.env.VITE_DATASET_PARTICIPANTE as string });
    return { responseEvent, responseActivities, responseParticipants };
  },
  component: App,
});

function App() {
  const { responseEvent, responseActivities, responseParticipants } = Route.useLoaderData();

  return (
    <main className="min-h-screen">
      <Header />
      <Hero event={responseEvent} activeEvent={responseActivities} participants={responseParticipants} />

      {/* <EventInfoSection formatedDataEvento={formatedDataEvento} /> */}
      <SponsorsSection />
      <SpeakersSection />
      <FeaturedSchedule />
      <GallerySection />
      <CTASection />
      <Footer />
    </main>
  );
}
