"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { handlePostFormParticipant } from "@/services/form-service";
import { toast } from "sonner";

interface RegistrationFormFieldsProps {
  onSuccess: () => void;
}

export function RegistrationFormFields({ onSuccess }: RegistrationFormFieldsProps) {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    cidade: "",
    estado: "",
    apae: "",
    categoria: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      await handlePostFormParticipant({
        documentId: import.meta.env.VITE_FORM_PARTICIPANTE as string,
        values: [
          {
            fieldId: "nome",
            value: formData.nome,
          },
          {
            fieldId: "email",
            value: formData.email,
          },
        ],
      });
      // Trigger success state
      onSuccess();
    } catch (error) {
      toast.error("Erro ao realizar inscrição");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nome">Nome Completo</Label>
          <Input id="nome" placeholder="Seu nome completo" required value={formData.nome} onChange={(e) => handleChange("nome", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" placeholder="seu@email.com" required value={formData.email} onChange={(e) => handleChange("email", e.target.value)} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="telefone">Telefone</Label>
          <Input id="telefone" placeholder="(00) 00000-0000" required value={formData.telefone} onChange={(e) => handleChange("telefone", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cpf">CPF</Label>
          <Input id="cpf" placeholder="000.000.000-00" required value={formData.cpf} onChange={(e) => handleChange("cpf", e.target.value)} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cidade">Cidade</Label>
          <Input id="cidade" placeholder="Sua cidade" required value={formData.cidade} onChange={(e) => handleChange("cidade", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="estado">Estado</Label>
          <Select onValueChange={(value) => handleChange("estado", value)}>
            <SelectTrigger id="estado">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AC">Acre</SelectItem>
              <SelectItem value="AL">Alagoas</SelectItem>
              <SelectItem value="AP">Amapá</SelectItem>
              <SelectItem value="AM">Amazonas</SelectItem>
              <SelectItem value="BA">Bahia</SelectItem>
              <SelectItem value="CE">Ceará</SelectItem>
              <SelectItem value="DF">Distrito Federal</SelectItem>
              <SelectItem value="ES">Espírito Santo</SelectItem>
              <SelectItem value="GO">Goiás</SelectItem>
              <SelectItem value="MA">Maranhão</SelectItem>
              <SelectItem value="MT">Mato Grosso</SelectItem>
              <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
              <SelectItem value="MG">Minas Gerais</SelectItem>
              <SelectItem value="PA">Pará</SelectItem>
              <SelectItem value="PB">Paraíba</SelectItem>
              <SelectItem value="PR">Paraná</SelectItem>
              <SelectItem value="PE">Pernambuco</SelectItem>
              <SelectItem value="PI">Piauí</SelectItem>
              <SelectItem value="RJ">Rio de Janeiro</SelectItem>
              <SelectItem value="RN">Rio Grande do Norte</SelectItem>
              <SelectItem value="RS">Rio Grande do Sul</SelectItem>
              <SelectItem value="RO">Rondônia</SelectItem>
              <SelectItem value="RR">Roraima</SelectItem>
              <SelectItem value="SC">Santa Catarina</SelectItem>
              <SelectItem value="SP">São Paulo</SelectItem>
              <SelectItem value="SE">Sergipe</SelectItem>
              <SelectItem value="TO">Tocantins</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="apae">APAE de Origem (opcional)</Label>
        <Input id="apae" placeholder="Nome da APAE" value={formData.apae} onChange={(e) => handleChange("apae", e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="categoria">Categoria</Label>
        <Select onValueChange={(value) => handleChange("categoria", value)}>
          <SelectTrigger id="categoria">
            <SelectValue placeholder="Selecione sua categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="profissional">Profissional da APAE</SelectItem>
            <SelectItem value="familiar">Familiar</SelectItem>
            <SelectItem value="autodefensor">Autodefensor</SelectItem>
            <SelectItem value="estudante">Estudante</SelectItem>
            <SelectItem value="convidado">Convidado</SelectItem>
            <SelectItem value="outro">Outro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" size="lg" className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
        Realizar Inscrição
      </Button>

      <p className="text-xs text-muted-foreground text-center">Ao se inscrever, você concorda com os termos de uso e política de privacidade da Fenapaes.</p>
    </form>
  );
}
