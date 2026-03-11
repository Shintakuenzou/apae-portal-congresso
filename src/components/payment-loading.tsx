import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";

interface PaymentLoadingProps {
  redirectUrl?: string;
}

export function PaymentLoading({ redirectUrl = "/pagamento" }: PaymentLoadingProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 60);

    return () => clearInterval(progressInterval);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      const timer = setTimeout(() => {
        window.open(redirectUrl);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [progress, redirectUrl]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6 rounded-2xl bg-card/80 p-8 shadow-lg backdrop-blur-md">
        <div className="relative flex h-20 w-20 items-center justify-center">
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-muted border-t-primary" />
          <ShoppingCart className="h-8 w-8 text-primary" />
        </div>

        <p className="text-lg font-medium text-foreground">Processando a sua compra...</p>

        <div className="h-1.5 w-56 overflow-hidden rounded-full bg-muted">
          <div className="h-full bg-primary transition-all duration-100 ease-out" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}
