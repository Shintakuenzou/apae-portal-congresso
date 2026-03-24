/**
 * @module components/galery
 * @description Seção de galeria de fotos exibida na página inicial.
 */
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { PHOTOS } from "@/constants";

export function GallerySection() {
  return (
    <section className="py-24 bg-[#f5f0ff]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-violet-950 text-white mb-4">Galeria</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">Galeria de fotos</h2>
            <p className="text-zinc-900 font-medium max-w-xl">Reviva os melhores momentos dos eventos anteriores e prepare-se para o Congresso 2023.</p>
          </div>
          <Button variant="outline" className="self-start md:self-auto group bg-transparent hover:bg-transparent" asChild>
            <Link to="/galeria">
              Ver Galeria Completa
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {PHOTOS.slice(0, 6).map((image, index) => (
            <button key={image.id} className={`relative overflow-hidden rounded-xl group cursor-auto ${index === 0 ? "col-span-2 row-span-2" : ""} ring-2 ring-violet-600/30`}>
              <div className={`bg-violet-950/90 ${index === 0 ? "h-full" : "h-44"}`}>
                <div className="absolute inset-0 bg-linear-to-t from-foreground/90 via-foreground/50  group-hover:opacity-80 transition-opacity ">
                  <img src={image.src || "/placeholder.svg"} alt={image.title} className="w-full h-full object-cover" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
