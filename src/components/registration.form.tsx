"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RegistrationInfo } from "./registration/registration-info";
import { RegistrationSuccess } from "./registration/registration-success";
import { RegistrationFormFields } from "./registration/registration-form-fields";

export function RegistrationForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return <RegistrationSuccess onReset={() => setSubmitted(false)} />;
  }

  return (
    <section id="inscricao" className="py-20 bg-violet-950 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <RegistrationInfo />

          <Card className="bg-card text-card-foreground">
            <CardHeader>
              <CardTitle>Formulário de Inscrição</CardTitle>
            </CardHeader>
            <CardContent>
              <RegistrationFormFields onSuccess={() => setSubmitted(true)} />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
