"use client";

import { useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SignatureUpload } from "./signature-upload";
import { submitMessage } from "./actions";

const schema = z.object({
  message: z.string().trim().max(2000, "Máximo 2000 caracteres"),
  signatureBase64: z.string(),
});

type FormValues = z.infer<typeof schema>;

export function MensajeForm({
  code,
  partnerName,
  initialMessage,
  initialSignature,
}: {
  code: string;
  partnerName: string;
  initialMessage: string;
  initialSignature: string;
}) {
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { message: initialMessage, signatureBase64: initialSignature },
  });

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      const result = await submitMessage(code, values);
      if (result?.error) {
        toast.error(result.error);
      }
    });
  };

  return (
    <main className="flex flex-1 flex-col items-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-md sm:max-w-lg">
        <Card className="letter-card">
          <CardHeader className="items-center gap-2 text-center">
            <div className="seal inline-flex size-14 items-center justify-center rounded-full">
              <HeartHandshake className="size-7" />
            </div>
            <CardTitle className="text-xl sm:text-2xl">
              ¿Quieres dejarle un mensaje a {partnerName}?
            </CardTitle>
            <CardDescription>
              Escribe unas palabras especiales para esta persona y firma con
              una imagen. Todo quedará guardado en el PDF final junto con sus
              respuestas. Si prefieres, puedes dejarlo en blanco y continuar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="message">Tu mensaje</Label>
                <Textarea
                  id="message"
                  rows={5}
                  placeholder={`Querido/a ${partnerName}...`}
                  aria-invalid={!!errors.message}
                  {...register("message")}
                />
                {errors.message && (
                  <p className="text-sm text-destructive">{errors.message.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Tu firma</Label>
                <Controller
                  control={control}
                  name="signatureBase64"
                  render={({ field }) => (
                    <SignatureUpload value={field.value} onChange={field.onChange} />
                  )}
                />
              </div>

              <Button type="submit" size="lg" className="h-12 w-full text-base" disabled={isPending}>
                {isPending ? "Guardando..." : "Continuar"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
