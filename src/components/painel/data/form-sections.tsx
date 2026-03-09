import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { escolaridades, estados } from "@/constants";
import { formatPhone } from "@/utils/format-phone";

interface SectionProps {
  formData: any;
  isEditing: boolean;
  handleInputChange: (field: string, value: string) => void;
  getEscolaridadeLabel?: (value: string) => string;
}

export function PersonalDataSection({ formData, isEditing, handleInputChange }: SectionProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Dados Pessoais</h3>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-muted-foreground">CPF</Label>
          <Input value={formData?.cpf || ""} disabled className="bg-muted/50" />
        </div>
        <div className="space-y-2">
          <Label className="text-muted-foreground">Data de Nascimento</Label>
          {isEditing ? (
            <Input type="date" value={formData?.data_nascimento || ""} onChange={(e) => handleInputChange("data_nascimento", e.target.value)} />
          ) : (
            <Input value={formData?.data_nascimento ? new Date(formData.data_nascimento as string).toLocaleDateString("pt-BR") : ""} disabled className="bg-muted/50" />
          )}
        </div>
        <div className="space-y-2">
          <Label className="text-muted-foreground">Nome</Label>
          {isEditing ? (
            <Input value={formData?.nome || ""} onChange={(e) => handleInputChange("nome", e.target.value)} />
          ) : (
            <Input value={formData?.nome || ""} disabled className="bg-muted/50" />
          )}
        </div>
        <div className="space-y-2">
          <Label className="text-muted-foreground">Sobrenome</Label>
          {isEditing ? (
            <Input value={formData?.sobrenome || ""} onChange={(e) => handleInputChange("sobrenome", e.target.value)} />
          ) : (
            <Input value={formData?.sobrenome || ""} disabled className="bg-muted/50" />
          )}
        </div>
      </div>
    </div>
  );
}

export function ContactDataSection({ formData, isEditing, handleInputChange }: SectionProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Contato</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2 sm:col-span-2">
          <Label className="text-muted-foreground">E-mail</Label>
          {isEditing ? (
            <Input type="email" value={formData?.email || ""} onChange={(e) => handleInputChange("email", e.target.value)} />
          ) : (
            <Input value={formData?.email || ""} disabled className="bg-muted/50" />
          )}
        </div>
        <div className="space-y-2">
          <Label className="text-muted-foreground">Telefone</Label>
          {isEditing ? (
            <Input value={formData?.telefone || ""} onChange={(e) => handleInputChange("telefone", formatPhone(e.target.value))} maxLength={15} />
          ) : (
            <Input value={formData?.telefone || ""} disabled className="bg-muted/50" />
          )}
        </div>
        <div className="space-y-2">
          <Label className="text-muted-foreground">WhatsApp</Label>
          {isEditing ? (
            <Input value={formData?.whatsapp || ""} onChange={(e) => handleInputChange("whatsapp", formatPhone(e.target.value))} maxLength={15} />
          ) : (
            <Input value={formData?.whatsapp || ""} disabled className="bg-muted/50" />
          )}
        </div>
      </div>
    </div>
  );
}

export function AddressDataSection({ formData, isEditing, handleInputChange }: SectionProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Endereco</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-muted-foreground">UF</Label>
          {isEditing ? (
            <Select value={formData?.uf || ""} onValueChange={(value) => handleInputChange("uf", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um estado" />
              </SelectTrigger>
              <SelectContent>
                {estados.map((estado) => (
                  <SelectItem key={estado} value={estado}>
                    {estado}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input value={formData?.uf || ""} disabled className="bg-muted/50" />
          )}
        </div>
        <div className="space-y-2">
          <Label className="text-muted-foreground">Municipio</Label>
          {isEditing ? (
            <Input value={formData?.municipio || ""} onChange={(e) => handleInputChange("municipio", e.target.value)} />
          ) : (
            <Input value={formData?.municipio || ""} disabled className="bg-muted/50" />
          )}
        </div>
      </div>
    </div>
  );
}

export function AdditionalInfoSection({ formData, isEditing, handleInputChange, getEscolaridadeLabel }: SectionProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Informacoes Adicionais</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-muted-foreground">Escolaridade</Label>
          {isEditing ? (
            <Select value={formData?.escolaridade || ""} onValueChange={(value) => handleInputChange("escolaridade", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {escolaridades.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input value={getEscolaridadeLabel?.(formData?.escolaridade as string) || ""} disabled className="bg-muted/50" />
          )}
        </div>
        <div className="space-y-2">
          <Label className="text-muted-foreground">APAE Filiada</Label>
          {isEditing ? (
            <Input value={formData?.apaeFiliada || ""} onChange={(e) => handleInputChange("apaeFiliada", e.target.value)} />
          ) : (
            <Input value={formData?.apaeFiliada || ""} disabled className="bg-muted/50" />
          )}
        </div>
      </div>
    </div>
  );
}
