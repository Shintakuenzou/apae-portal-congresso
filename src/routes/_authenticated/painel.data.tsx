import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { escolaridades } from "@/constants";
import { useAuth } from "@/context/auth-context";
import { handleUpdateFormParticipant } from "@/services/form-service";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Pencil, X, Save } from "lucide-react";
import { useState } from "react";
import { PersonalDataSection, ContactDataSection, AddressDataSection, AdditionalInfoSection } from "@/components/painel/data/form-sections";
import { clearAuthCookies, getAuthCookie, isTokenExpired } from "@/lib/cookie";
import { fetchDataset } from "@/services/fetch-dataset";
import type { TokenProps } from "@/types/token";

export const Route = createFileRoute("/_authenticated/painel/data")({
  component: RouteComponent,
});

function RouteComponent() {
  const { updateUser, user } = useAuth();
  const [formData, setFormData] = useState(user);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  console.table(user);

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
    setFormData((prev) => prev && { ...prev, [field]: value });
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
          <PersonalDataSection formData={formData} isEditing={isEditing} handleInputChange={handleInputChange} />

          <Separator />

          <ContactDataSection formData={formData} isEditing={isEditing} handleInputChange={handleInputChange} />

          <Separator />

          <AddressDataSection formData={formData} isEditing={isEditing} handleInputChange={handleInputChange} />

          <Separator />

          <AdditionalInfoSection formData={formData} isEditing={isEditing} handleInputChange={handleInputChange} getEscolaridadeLabel={getEscolaridadeLabel} />
        </CardContent>
      </Card>
    </div>
  );
}
