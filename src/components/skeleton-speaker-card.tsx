import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonSpeakerCard() {
  return (
    <Card className="border-border">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          {/* Avatar circular */}
          <Skeleton className="w-24 h-24 rounded-full mb-4" />

          {/* Badge empresa/faculdade */}
          <Skeleton className="h-5 w-28 rounded-full mb-3" />

          {/* Nome */}
          <Skeleton className="h-5 w-36 mb-1" />

          {/* Empresa (repetida abaixo do nome) */}
          <Skeleton className="h-4 w-28 mb-3" />

          {/* Descrição — 3 linhas */}
          <div className="w-full space-y-1.5 mb-4">
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-4/5 mx-auto" />
          </div>
        </div>

        {/* Redes sociais */}
        <div className="flex items-center justify-center gap-3">
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="w-8 h-8 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}

/** Grid de N skeletons, padrão 8 */
export function SkeletonSpeakersGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonSpeakerCard key={i} />
      ))}
    </div>
  );
}
