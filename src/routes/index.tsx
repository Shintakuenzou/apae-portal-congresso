import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { FeaturedSchedule } from "@/components/featured-schedule";
import { CTASection } from "@/components/cta-section";
import { Footer } from "@/components/footer";
import { SpeakersSection } from "@/components/speakers-section";
import { GallerySection } from "@/components/galery";
import { useEvents } from "@/hooks/useEvents";
import { LoadingScreen } from "@/components/loading";
import { SponsorsSection } from "@/components/sponsor-section";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const { formatedDataEvento, isLoading } = useEvents();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <main className="min-h-screen">
      <Header />
      <Hero formatedDataEvento={formatedDataEvento} />

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
