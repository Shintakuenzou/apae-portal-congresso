import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { CheckCircle, Mail, MapPinned, User, Lock, Briefcase, Heart, Loader2 } from "lucide-react";
import { handlePostFormParticipant } from "@/services/form-service";
import { formatCPF } from "@/utils/format-cpf";
import { formatPhone } from "@/utils/format-phone";
import { escolaridades, estados, tamanhosCamisa } from "@/constants";
import { fetchDataset } from "@/services/fetch-dataset";
import type { AxiosError } from "axios";
import axios from "axios";
import { fetchCep } from "@/services/cep";
import { formatCEP } from "@/utils/format-cep";
import { toast } from "sonner";
import { format } from "date-fns";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useQuery } from "@tanstack/react-query";
import { sha256 } from "@/utils/hash-pass";

export const Route = createFileRoute("/inscricao")({
  component: InscricaoPage,
});

// Schema de validação com Zod
const formSchema = z.object({
  criado_em: z.string(),
  criado_por: z.string(),
  cpf: z.string().min(14, "CPF deve ter 11 dígitos").max(14),
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  sobrenome: z.string().min(2, "Sobrenome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  dataNascimento: z.string().min(1, "Data de nascimento é obrigatória"),
  cep: z.string().min(8, "CEP inválido"),
  uf: z.string().min(2, "Selecione um estado"),
  municipio: z.string().min(2, "Município é obrigatório"),
  telefone: z.string().min(14, "Telefone inválido"),
  whatsapp: z.string(),
  escolaridade: z.string(),
  tamanho_camisa: z.string().min(1, "Selecione a escolaridade"),
  apaeFiliada: z.string(),
  senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  presidente_apae: z.string().optional(),
  funcao: z.string().optional(),
  area_atuacao: z.string().optional(),
  possui_deficiencia: z.string().optional(),
  tipo_deficiencia: z.string().optional(),
  necessita_apoio: z.string().optional(),
  tipo_apoio: z.string().optional(),
  outros_apoio: z.string().optional(),
  coordenacao: z.string().optional(),
  tamanho_camiseta: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

function InscricaoPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      criado_em: format(new Date(Date.now()), "yyyy-MM-dd"),
      criado_por: "",
      cpf: "",
      nome: "",
      sobrenome: "",
      email: "",
      dataNascimento: "",
      cep: "",
      uf: "",
      municipio: "",
      telefone: "",
      whatsapp: "",
      escolaridade: "",
      tamanho_camisa: "",
      apaeFiliada: "",
      senha: "",
      presidente_apae: "",
      funcao: "",
      area_atuacao: "",
      possui_deficiencia: "",
      tipo_deficiencia: "",
      necessita_apoio: "Nao",
      tipo_apoio: "",
      outros_apoio: "",
      coordenacao: "",
      tamanho_camiseta: "",
    },
  });

  const { data: apaes } = useQuery({
    queryKey: ["apaes"],
    queryFn: () =>
      fetchDataset({
        datasetId: "dsConsultaApaesFeapaes",
        constraints: watch("uf")
          ? [
              {
                fieldName: "lastname",
                initialValue: watch("uf") ?? "",
                finalValue: watch("uf") ?? "",
                constraintType: "MUST",
              },
            ]
          : [],
      }),
    enabled: !!watch("uf"),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    console.log("data submit", data);

    const hshPs = await sha256(data.senha);

    try {
      const response = await handlePostFormParticipant({
        documentId: import.meta.env.VITE_FORM_PARTICIPANTE as string,
        values: [
          { fieldId: "criado_em", value: data.criado_em },
          { fieldId: "cpf", value: data.cpf.replace(/\D/g, "") },
          { fieldId: "senha", value: hshPs },
          { fieldId: "nome", value: data.nome },
          { fieldId: "sobrenome", value: data.sobrenome },
          { fieldId: "email", value: data.email },
          { fieldId: "data_nascimento", value: data.dataNascimento },
          { fieldId: "uf", value: data.uf },
          { fieldId: "municipio", value: data.municipio },
          { fieldId: "telefone_contato", value: data.telefone },
          { fieldId: "whatsapp", value: data.whatsapp },
          { fieldId: "escolaridade", value: data.escolaridade },
          { fieldId: "apae_filiada", value: data.apaeFiliada || "" },
          { fieldId: "presidente_apae", value: data.presidente_apae || "" },
          { fieldId: "funcao", value: data.funcao || "" },
          { fieldId: "area_atuacao", value: data.area_atuacao || "" },
          { fieldId: "possui_deficiencia", value: data.possui_deficiencia || "" },
          { fieldId: "tipo_deficiencia", value: data.tipo_deficiencia || "" },
          { fieldId: "necessita_apoio", value: data.necessita_apoio || "" },
          { fieldId: "tipo_apoio", value: data.tipo_apoio != "Outros" ? data.tipo_apoio || "" : data.outros_apoio || "" },
          { fieldId: "coordenacao", value: data.coordenacao || "" },
          { fieldId: "tamanho_camiseta", value: data.tamanho_camiseta || "" },
          { fieldId: "cep", value: data.cep || "" },
        ],
      });

      if (response && response.values.length > 0) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error("Error submitting form data:", error);
      toast.error("Erro ao enviar formulário");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <section className="pt-32 pb-24 min-h-[80vh] flex items-center">
          <div className="mx-auto max-w-lg px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-20 h-20 bg-violet-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">Inscricao Realizada!</h1>

            <Button type="button" variant="outline" size="lg" asChild>
              <Link to="/login">Fazer Login</Link>
            </Button>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  const handleCheckExistingParticipant = async (cpf: string) => {
    const formatCPF = cpf.replace(/\D/g, "");
    try {
      const response = await fetchDataset({
        datasetId: "cadParticipanteCN",
        constraints: [
          {
            fieldName: "cpf",
            initialValue: formatCPF,
            finalValue: formatCPF,
            constraintType: "MUST",
          },
        ],
      });
      return response;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        console.error("Axios error submitting form data:", axiosError.response?.data || axiosError.message);
        return;
      }
    }
  };

  const handlePopulateAddressFromCep = async (cep: string) => {
    const formattedCep = cep.replace(/\D/g, "");
    try {
      const response = await fetchCep(formattedCep);
      if (response) {
        setValue("uf", response.uf);
        setValue("municipio", response.localidade);
      }
    } catch (error) {
      console.error("Erro ao buscar endereco pelo CEP:", error);
    }
  };

  const handlePopulateInfoFromCpf = async (cpf: string) => {
    const formatCPF = cpf.replace(/\D/g, "");

    try {
      const response = await fetchDataset({
        datasetId: "dsConsultaCpfCadastrado",
        constraints: [
          {
            fieldName: "cpf",
            initialValue: formatCPF,
            finalValue: formatCPF,
            constraintType: "MUST",
          },
        ],
      });

      if (response.items.length > 0) {
        const participant = response.items[0];
        const [firstName, ...rest] = participant["nome"]?.toString().split(" ") as string[];
        setValue("nome", firstName || "");
        setValue("sobrenome", rest.join(" ") || "");

        setValue("dataNascimento", participant["data_nascimento"]?.toString() || "");
      }
    } catch (error: unknown) {
      toast.warning("CPF nao encontrado no sistema.");
    }
  };

  async function handleBlurCPF(event: React.FocusEvent<HTMLInputElement>) {
    try {
      const response = await handleCheckExistingParticipant(event.target.value);

      if (response && response?.items && response.items[0]) {
        toast.warning("CPF já cadastrado!", { position: "bottom-right", duration: 4000 });
        setValue("cpf", "");
        setValue("nome", "");
        setValue("sobrenome", "");
        return;
      }

      await handlePopulateInfoFromCpf(event.target.value);
    } catch (error) {
      console.error("Erro ao verificar CPF existente:", error);
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="pt-32 pb-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-5">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">Inscrição</h1>
            <p className="text-muted-foreground text-lg">Preencha seus dados para participar do Congresso Nacional APAE Brasil 2026</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Dados Pessoais */}
            <Card className="border-border shadow-sm">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-violet-600/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-violet-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-lg text-foreground">Dados Pessoais</h2>
                    <p className="text-sm text-muted-foreground">Informacoes basicas de identificacao</p>
                  </div>
                </div>

                <FieldSet className="w-full">
                  <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field className="md:col-span-2">
                      <FieldLabel htmlFor="cpf">CPF *</FieldLabel>
                      <Controller
                        name="cpf"
                        control={control}
                        render={({ field }) => (
                          <Input
                            id="cpf"
                            placeholder="000.000.000-00"
                            maxLength={14}
                            {...field}
                            onChange={(e) => field.onChange(formatCPF(e.target.value))}
                            onBlur={(e) => handleBlurCPF(e)}
                            className="h-11"
                          />
                        )}
                      />
                      {errors.cpf && <p className="text-sm text-destructive mt-1">{errors.cpf.message}</p>}
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="nome">Nome *</FieldLabel>
                      <Input id="nome" placeholder="Seu nome" {...register("nome")} className="h-11" />
                      {errors.nome && <p className="text-sm text-destructive mt-1">{errors.nome.message}</p>}
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="sobrenome">Sobrenome *</FieldLabel>
                      <Input id="sobrenome" placeholder="Seu sobrenome" {...register("sobrenome")} className="h-11" />
                      {errors.sobrenome && <p className="text-sm text-destructive mt-1">{errors.sobrenome.message}</p>}
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="dataNascimento">Data de Nascimento *</FieldLabel>
                      <Input id="dataNascimento" type="date" {...register("dataNascimento")} className="h-11" />
                      {errors.dataNascimento && <p className="text-sm text-destructive mt-1">{errors.dataNascimento.message}</p>}
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="escolaridade">Escolaridade *</FieldLabel>
                      <Controller
                        name="escolaridade"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger id="escolaridade" className="!h-11 w-full">
                              <SelectValue placeholder="Selecione sua escolaridade" />
                            </SelectTrigger>
                            <SelectContent>
                              {escolaridades.map((esc) => (
                                <SelectItem key={esc.value} value={esc.value}>
                                  {esc.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.escolaridade && <p className="text-sm text-destructive mt-1">{errors.escolaridade.message}</p>}
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="tamanho_camisa">Tamanho de Camisa *</FieldLabel>
                      <Controller
                        name="tamanho_camisa"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger id="tamanho_camisa" className="!h-11 w-full">
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
                        )}
                      />
                      {errors.tamanho_camisa && <p className="text-sm text-destructive mt-1">{errors.tamanho_camisa.message}</p>}
                    </Field>
                  </FieldGroup>
                </FieldSet>
              </CardContent>
            </Card>

            {/* Contato */}
            <Card className="border-border shadow-sm">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-violet-600/10 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-violet-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-lg text-foreground">Informações de Contato</h2>
                    <p className="text-sm text-muted-foreground">Como podemos entrar em contato com voce</p>
                  </div>
                </div>

                <FieldSet className="w-full">
                  <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field className="md:col-span-2">
                      <FieldLabel htmlFor="email">E-mail *</FieldLabel>
                      <Input id="email" type="email" placeholder="seu@email.com" {...register("email")} className="h-11" />
                      {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="telefone">Telefone de Contato *</FieldLabel>
                      <Controller
                        name="telefone"
                        control={control}
                        render={({ field }) => (
                          <Input
                            id="telefone"
                            placeholder="(00) 00000-0000"
                            maxLength={15}
                            {...field}
                            onChange={(e) => field.onChange(formatPhone(e.target.value))}
                            className="h-11"
                          />
                        )}
                      />
                      {errors.telefone && <p className="text-sm text-destructive mt-1">{errors.telefone.message}</p>}
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="whatsapp">WhatsApp *</FieldLabel>
                      <Controller
                        name="whatsapp"
                        control={control}
                        render={({ field }) => (
                          <Input
                            id="whatsapp"
                            placeholder="(00) 00000-0000"
                            maxLength={15}
                            {...field}
                            onChange={(e) => field.onChange(formatPhone(e.target.value))}
                            className="h-11"
                          />
                        )}
                      />
                      {errors.whatsapp && <p className="text-sm text-destructive mt-1">{errors.whatsapp.message}</p>}
                    </Field>
                  </FieldGroup>
                </FieldSet>
              </CardContent>
            </Card>

            {/* Endereco */}
            <Card className="border-border shadow-sm">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-violet-600/10 flex items-center justify-center">
                    <MapPinned className="h-5 w-5 text-violet-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-lg text-foreground">Localizacao</h2>
                    <p className="text-sm text-muted-foreground">Seu endereco atual</p>
                  </div>
                </div>

                <FieldSet className="w-full">
                  <FieldGroup className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Field className="md:col-span-2">
                      <FieldLabel htmlFor="cep">CEP *</FieldLabel>
                      <Controller
                        name="cep"
                        control={control}
                        render={({ field }) => (
                          <Input
                            id="cep"
                            placeholder="00000-000"
                            maxLength={9}
                            {...field}
                            onChange={(e) => field.onChange(formatCEP(e.target.value))}
                            onBlur={(e) => handlePopulateAddressFromCep(e.target.value)}
                            className="h-11"
                          />
                        )}
                      />
                      {errors.cep && <p className="text-sm text-destructive mt-1">{errors.cep.message}</p>}
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="uf">Estado (UF) *</FieldLabel>
                      <Controller
                        name="uf"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger id="uf" className="!h-11 w-full">
                              <SelectValue placeholder="UF" />
                            </SelectTrigger>
                            <SelectContent>
                              {estados.map((uf) => (
                                <SelectItem key={uf} value={uf}>
                                  {uf}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.uf && <p className="text-sm text-destructive mt-1">{errors.uf.message}</p>}
                    </Field>

                    <Field className="md:col-span-2">
                      <FieldLabel htmlFor="municipio">Municipio *</FieldLabel>
                      <Input id="municipio" placeholder="Sua cidade" {...register("municipio")} className="h-11" />
                      {errors.municipio && <p className="text-sm text-destructive mt-1">{errors.municipio.message}</p>}
                    </Field>
                  </FieldGroup>
                </FieldSet>
              </CardContent>
            </Card>

            {/* Informacoes Profissionais */}
            <Card className="border-border shadow-sm">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-violet-600/10 flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-violet-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-lg text-foreground">Informações Profissionais</h2>
                    <p className="text-sm text-muted-foreground">Dados sobre sua atuacao na APAE</p>
                  </div>
                </div>

                <FieldSet className="w-full">
                  <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field className="md:col-span-2">
                      <FieldLabel htmlFor="apaeFiliada">APAE Filiada *</FieldLabel>
                      <Autocomplete
                        disablePortal
                        options={apaes?.items?.map((apae) => apae.firstName) || []}
                        sx={{ width: "100%" }}
                        renderInput={(params) => <TextField {...params} label="Apae Filiada" />}
                        onChange={(_, value) => {
                          setValue("apaeFiliada", (value as string) || "");
                        }}
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="presidente_apae">Sou presidente da apae</FieldLabel>

                      <Controller
                        name="presidente_apae"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger id="presidente_apae" className="!h-11 w-full">
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Sim">Sim</SelectItem>
                              <SelectItem value="Nao">Nao</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </Field>

                    {watch("presidente_apae") === "Nao" && (
                      <Field>
                        <FieldLabel htmlFor="funcao">Função</FieldLabel>
                        <Input id="funcao" placeholder="Sua funcao" {...register("funcao")} className="h-11" />
                      </Field>
                    )}

                    <Field className="md:col-span-2">
                      <FieldLabel htmlFor="area_atuacao">Area de Atuação</FieldLabel>
                      <Input id="area_atuacao" placeholder="Qual sua area de atuação?" {...register("area_atuacao")} className="h-11" />
                    </Field>

                    {/* {watch("presidente_apae") === "Nao" && (
                      <Field className="col-span-2">
                        <FieldLabel htmlFor="coordenacao">Coordenação</FieldLabel>
                        <Input id="coordenacao" placeholder="Digite sua coordenação" {...register("coordenacao")} className="h-11" />
                      </Field>
                    )} */}
                  </FieldGroup>
                </FieldSet>
              </CardContent>
            </Card>

            {/* Acessibilidade */}
            <Card className="border-border shadow-sm">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-violet-600/10 flex items-center justify-center">
                    <Heart className="h-5 w-5 text-violet-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-lg text-foreground">Acessibilidade</h2>
                    <p className="text-sm text-muted-foreground">Informacoes para garantir sua participacao</p>
                  </div>
                </div>

                <FieldSet className="w-full">
                  <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel htmlFor="possui_deficiencia">Possui Deficiencia?</FieldLabel>
                      <Controller
                        name="possui_deficiencia"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger id="possui_deficiencia" className="!h-11 w-full">
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Sim">Sim</SelectItem>
                              <SelectItem value="Nao">Nao</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="necessita_apoio">Necessita de Apoio Especial?</FieldLabel>

                      <Controller
                        name="necessita_apoio"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger id="necessita_apoio" className="!h-11 w-full">
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Sim">Sim</SelectItem>
                              <SelectItem value="Nao">Nao</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </Field>

                    {/* {watch("possui_deficiencia") === "Sim" && (
                      <>
                        <Field>
                          <FieldLabel htmlFor="tipo_deficiencia">Tipo de Deficiencia</FieldLabel>

                          <Controller
                            name="tipo_deficiencia"
                            control={control}
                            render={({ field }) => (
                              <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger id="tipo_deficiencia" className="!h-11 w-full">
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                  {DISABILITY_OPTIONS.map((option) => {
                                    return (
                                      <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                      </SelectItem>
                                    );
                                  })}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </Field>
                      </>
                    )}

                    {watch("necessita_apoio") === "Sim" && (
                      <Field>
                        <FieldLabel htmlFor="necessita_apoio">Tipo de apoio</FieldLabel>

                        <Controller
                          name="tipo_apoio"
                          control={control}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger id="tipo_apoio" className="!h-11 w-full">
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                              <SelectContent>
                                {opcao_apoio.map((option) => {
                                  return (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </Field>
                    )}

                    {watch("tipo_apoio") === "Outros" && (
                      <Field>
                        <FieldLabel htmlFor="outros_apoio">Descreva o tipo de apoio</FieldLabel>
                        <Controller
                          name="outros_apoio"
                          control={control}
                          render={({ field }) => <Input id="outros_apoio" placeholder="Descreva o tipo de apoio" {...field} className="h-11" />}
                        />
                      </Field>
                    )} */}
                  </FieldGroup>
                </FieldSet>
              </CardContent>
            </Card>

            {/* Senha de Acesso */}
            <Card className="border-border shadow-sm">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-violet-600/10 flex items-center justify-center">
                    <Lock className="h-5 w-5 text-violet-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-lg text-foreground">Senha de Acesso</h2>
                    <p className="text-sm text-muted-foreground">Crie uma senha para acessar sua inscricao</p>
                  </div>
                </div>

                <FieldSet className="w-full">
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="senha">Senha *</FieldLabel>
                      <FieldDescription>Use esta senha para acessar e gerenciar sua inscricao</FieldDescription>
                      <Input id="senha" type="password" placeholder="Minimo 6 caracteres" {...register("senha")} className="h-11" />
                      {errors.senha && <p className="text-sm text-destructive mt-1">{errors.senha.message}</p>}
                    </Field>
                  </FieldGroup>
                </FieldSet>
              </CardContent>
            </Card>

            <div className="flex flex-col items-center gap-4 pt-4">
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full md:w-auto min-w-[300px] h-12 text-base font-semibold bg-violet-600 hover:bg-violet-600/90 text-white cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Confirmar Inscricao"
                )}
              </Button>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}
