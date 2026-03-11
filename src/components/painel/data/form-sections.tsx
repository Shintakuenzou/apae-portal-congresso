import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { escolaridades, estados, tamanhosCamisa } from "@/constants";
import { formatPhone } from "@/utils/format-phone";

interface SectionProps {
  formData: any;
  isEditing: boolean;
  handleInputChange: (field: string, value: string) => void;
  getEscolaridadeLabel?: (value: string) => string;
}

function ReadInput({ value }: { value: string }) {
  return <Input value={value} disabled className="bg-muted/50" />;
}

// ─── 1. DADOS PESSOAIS ────────────────────────────────────────────
export function PersonalDataSection({ formData, isEditing, handleInputChange }: SectionProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Dados Pessoais</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-5">
          <Label className="text-muted-foreground">CPF</Label>
          <ReadInput value={formData?.cpf || ""} />
        </div>

        <div className="space-y-5">
          <Label className="text-muted-foreground">Data de Nascimento</Label>
          {isEditing ? (
            <Input type="date" value={formData?.data_nascimento || ""} onChange={(e) => handleInputChange("data_nascimento", e.target.value)} />
          ) : (
            <ReadInput value={formData?.data_nascimento ? new Date(formData.data_nascimento).toLocaleDateString("pt-BR") : ""} />
          )}
        </div>

        <div className="space-y-5">
          <Label className="text-muted-foreground">Nome</Label>
          {isEditing ? <Input value={formData?.nome || ""} onChange={(e) => handleInputChange("nome", e.target.value)} /> : <ReadInput value={formData?.nome || ""} />}
        </div>

        <div className="space-y-5">
          <Label className="text-muted-foreground">Sobrenome</Label>
          {isEditing ? (
            <Input value={formData?.sobrenome || ""} onChange={(e) => handleInputChange("sobrenome", e.target.value)} />
          ) : (
            <ReadInput value={formData?.sobrenome || ""} />
          )}
        </div>

        <div className="space-y-5">
          <Label className="text-muted-foreground">Escolaridade</Label>
          {isEditing ? (
            <Select value={formData?.escolaridade || ""} onValueChange={(v) => handleInputChange("escolaridade", v)}>
              <SelectTrigger className="!h-11 w-full" id="escolaridade">
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
            <ReadInput value={formData?.escolaridade || ""} />
          )}
        </div>

        <div className="space-y-5">
          <Label className="text-muted-foreground">Tamanho Camiseta</Label>
          {isEditing ? (
            <Select value={formData?.tamanho_camiseta || ""} onValueChange={(v) => handleInputChange("tamanho_camiseta", v)}>
              <SelectTrigger id="tamanho_camiseta" className="!h-11 w-full">
                <SelectValue placeholder="Selecione seu tamanho de camisa" />
              </SelectTrigger>
              <SelectContent>
                {tamanhosCamisa.map((esc) => (
                  <SelectItem key={esc} value={esc}>
                    {esc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <ReadInput value={formData?.tamanho_camiseta || ""} />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── 2. DADOS DA APAE ─────────────────────────────────────────────
export function ApaeDataSection({ formData, isEditing, handleInputChange }: SectionProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Dados da APAE</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-5">
          <Label className="text-muted-foreground">APAE Filiada</Label>
          {isEditing ? (
            <Input value={formData?.apaeFiliada || ""} onChange={(e) => handleInputChange("apaeFiliada", e.target.value)} />
          ) : (
            <ReadInput value={formData?.apaeFiliada || ""} />
          )}
        </div>

        <div className="space-y-5">
          <Label className="text-muted-foreground">Presidente APAE</Label>
          {isEditing ? (
            <Input value={formData?.presidente_apae || ""} onChange={(e) => handleInputChange("presidente_apae", e.target.value)} />
          ) : (
            <ReadInput value={formData?.presidente_apae || ""} />
          )}
        </div>

        <div className="space-y-5">
          <Label className="text-muted-foreground">Função</Label>
          {isEditing ? <Input value={formData?.funcao || ""} onChange={(e) => handleInputChange("funcao", e.target.value)} /> : <ReadInput value={formData?.funcao || ""} />}
        </div>

        <div className="space-y-5">
          <Label className="text-muted-foreground">Área de Atuação</Label>
          {isEditing ? (
            <Input value={formData?.area_atuacao || ""} onChange={(e) => handleInputChange("area_atuacao", e.target.value)} />
          ) : (
            <ReadInput value={formData?.area_atuacao || ""} />
          )}
        </div>

        <div className="space-y-5">
          <Label className="text-muted-foreground">Coordenação</Label>
          {isEditing ? (
            <Input value={formData?.coordenacao || ""} onChange={(e) => handleInputChange("coordenacao", e.target.value)} />
          ) : (
            <ReadInput value={formData?.coordenacao || ""} />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── 3. CONTATO ───────────────────────────────────────────────────
export function ContactDataSection({ formData, isEditing, handleInputChange }: SectionProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Contato</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-5 sm:col-span-2">
          <Label className="text-muted-foreground">E-mail</Label>
          {isEditing ? (
            <Input type="email" value={formData?.email || ""} onChange={(e) => handleInputChange("email", e.target.value)} />
          ) : (
            <ReadInput value={formData?.email || ""} />
          )}
        </div>

        <div className="space-y-5">
          <Label className="text-muted-foreground">Telefone</Label>
          {isEditing ? (
            <Input value={formData?.telefone || ""} onChange={(e) => handleInputChange("telefone_contato", formatPhone(e.target.value))} maxLength={15} />
          ) : (
            <ReadInput value={formData?.telefone || ""} />
          )}
        </div>

        <div className="space-y-5">
          <Label className="text-muted-foreground">WhatsApp</Label>
          {isEditing ? (
            <Input value={formData?.whatsapp || ""} onChange={(e) => handleInputChange("whatsapp", formatPhone(e.target.value))} maxLength={15} />
          ) : (
            <ReadInput value={formData?.whatsapp || ""} />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── 4. ENDEREÇO ──────────────────────────────────────────────────
export function AddressDataSection({ formData, isEditing, handleInputChange }: SectionProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Endereço</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-5">
          <Label className="text-muted-foreground">CEP</Label>
          {isEditing ? <Input value={formData?.cep || ""} onChange={(e) => handleInputChange("cep", e.target.value)} /> : <ReadInput value={formData?.cep || ""} />}
        </div>

        <div className="space-y-5">
          <Label className="text-muted-foreground">UF</Label>
          {isEditing ? (
            <Select value={formData?.uf || ""} onValueChange={(v) => handleInputChange("uf", v)}>
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
            <ReadInput value={formData?.uf || ""} />
          )}
        </div>

        <div className="space-y-5">
          <Label className="text-muted-foreground">Município</Label>
          {isEditing ? (
            <Input value={formData?.municipio || ""} onChange={(e) => handleInputChange("municipio", e.target.value)} />
          ) : (
            <ReadInput value={formData?.municipio || ""} />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── 5. DEFICIÊNCIA / APOIO ───────────────────────────────────────
export function AccessibilitySection({ formData, isEditing, handleInputChange }: SectionProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Deficiência e Apoio</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-5">
          <Label className="text-muted-foreground">Possui Deficiência</Label>
          {isEditing ? (
            <Select value={formData?.possui_deficiencia || ""} onValueChange={(v) => handleInputChange("possui_deficiencia", v)}>
              <SelectTrigger className="!h-11 w-full">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sim">Sim</SelectItem>
                <SelectItem value="nao">Não</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <ReadInput value={formData?.possui_deficiencia || ""} />
          )}
        </div>

        <div className="space-y-5">
          <Label className="text-muted-foreground">Necessita Apoio</Label>
          {isEditing ? (
            <Select value={formData?.necessita_apoio || ""} onValueChange={(v) => handleInputChange("necessita_apoio", v)}>
              <SelectTrigger className="!h-11 w-full">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sim">Sim</SelectItem>
                <SelectItem value="nao">Não</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <ReadInput value={formData?.necessita_apoio || ""} />
          )}
        </div>
      </div>
    </div>
  );
}
