import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface Order {
  id: string | number;
  evento: string;
  data: string;
  valor: string;
  formaPagamento: string;
}

interface OrderCardProps {
  compra: Order;
  onClick: (compra: Order) => void;
}

export function OrderCard({ compra, onClick }: OrderCardProps) {
  return (
    <div className="border rounded-xl p-4 hover:border-violet-600/50 hover:shadow-md cursor-pointer transition-all" onClick={() => onClick(compra)}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground">{compra.evento}</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Pedido #{compra.id} | {compra.data}
          </p>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-4">
          <div className="text-right">
            <p className="font-bold text-foreground">{compra.valor}</p>
            <p className="text-xs text-muted-foreground">{compra.formaPagamento}</p>
          </div>
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
