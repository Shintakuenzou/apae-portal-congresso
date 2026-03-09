import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { escolaridades, estados } from "@/constants";
import { useAuth } from "@/context/auth-context";
import { handleUpdateFormParticipant } from "@/services/form-service";
import { formatPhone } from "@/utils/format-phone";
import { createFileRoute } from "@tanstack/react-router";
import { Pencil, X, Save } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/painel/data")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState(user);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!formData?.cardid) {
      console.error("cardid não encontrado no usuário:", formData);
      return;
    }

    setIsSaving(true);
    try {
      const formatedPutFormData = Object.entries(formData).map(([key, value]) => ({
        fieldId: key,
        value: value as string,
      }));

      const updateResponse = await handleUpdateFormParticipant({
        documentId: import.meta.env.VITE_FORM_PARTICIPANTE as string,
        cardId: formData.documentid, // ✅ campo correto
        values: formatedPutFormData,
      });

      if (updateResponse?.values?.length > 0) {
        setIsEditing(false);
        updateUser(formData);
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(user!);
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const getEscolaridadeLabel = (value: string) => {
    return escolaridades.find((opt) => opt.value === value)?.label || value;
  };

  return (
    <div className="col-span-4 lg:col-span-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle className="text-xl">Dados Cadastrais</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Inscricao: {formData?.inscricao} | Realizada em {formData?.dataInscricao}
            </p>
          </div>
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="bg-transparent">
              <Pencil className="h-4 w-4 mr-2" />
              Editar
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCancel} className="bg-transparent">
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button size="sm" onClick={handleSave} disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Dados Pessoais */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Dados Pessoais</h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground">CPF</Label>
                <Input value={formData?.cpf} disabled className="bg-muted/50" />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Data de Nascimento</Label>
                {isEditing ? (
                  <Input type="date" value={formData?.data_nascimento} onChange={(e) => handleInputChange("data_nascimento", e.target.value)} />
                ) : (
                  <Input value={new Date(formData!.data_nascimento as string).toLocaleDateString("pt-BR")} disabled className="bg-muted/50" />
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Nome</Label>
                {isEditing ? (
                  <Input value={formData?.nome} onChange={(e) => handleInputChange("nome", e.target.value)} />
                ) : (
                  <Input value={formData?.nome} disabled className="bg-muted/50" />
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Sobrenome</Label>
                {isEditing ? (
                  <Input value={formData?.sobrenome} onChange={(e) => handleInputChange("sobrenome", e.target.value)} />
                ) : (
                  <Input value={formData?.sobrenome} disabled className="bg-muted/50" />
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Contato */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Contato</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2 sm:col-span-2">
                <Label className="text-muted-foreground">E-mail</Label>
                {isEditing ? (
                  <Input type="email" value={formData?.email} onChange={(e) => handleInputChange("email", e.target.value)} />
                ) : (
                  <Input value={formData?.email} disabled className="bg-muted/50" />
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Telefone</Label>
                {isEditing ? (
                  <Input value={formData?.telefone} onChange={(e) => handleInputChange("telefone", formatPhone(e.target.value))} maxLength={15} />
                ) : (
                  <Input value={formData?.telefone} disabled className="bg-muted/50" />
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">WhatsApp</Label>
                {isEditing ? (
                  <Input value={formData?.whatsapp} onChange={(e) => handleInputChange("whatsapp", formatPhone(e.target.value))} maxLength={15} />
                ) : (
                  <Input value={formData?.whatsapp} disabled className="bg-muted/50" />
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Endereco */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Endereco</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground">UF</Label>
                {isEditing ? (
                  <Select value={formData?.uf} onValueChange={(value) => handleInputChange("uf", value)}>
                    <SelectTrigger>
                      <SelectValue />
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
                  <Input value={formData?.uf} disabled className="bg-muted/50" />
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Municipio</Label>
                {isEditing ? (
                  <Input value={formData?.municipio} onChange={(e) => handleInputChange("municipio", e.target.value)} />
                ) : (
                  <Input value={formData?.municipio} disabled className="bg-muted/50" />
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Informacoes Adicionais */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Informacoes Adicionais</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Escolaridade</Label>
                {isEditing ? (
                  <Select value={formData?.escolaridade} onValueChange={(value) => handleInputChange("escolaridade", value)}>
                    <SelectTrigger>
                      <SelectValue />
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
                  <Input value={getEscolaridadeLabel(formData?.escolaridade as string)} disabled className="bg-muted/50" />
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">APAE Filiada</Label>
                {isEditing ? (
                  <Input value={formData?.apaeFiliada} onChange={(e) => handleInputChange("apaeFiliada", e.target.value)} />
                ) : (
                  <Input value={formData?.apaeFiliada} disabled className="bg-muted/50" />
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
