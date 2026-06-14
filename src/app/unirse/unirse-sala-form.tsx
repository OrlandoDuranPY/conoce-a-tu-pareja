"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROOM_CODE_LENGTH } from "@/lib/room-code";
import { elegirParticipante, unirseSala, type UnirseResult } from "./actions";

const schema = z.object({
  code: z
    .string()
    .trim()
    .length(ROOM_CODE_LENGTH, `El código debe tener ${ROOM_CODE_LENGTH} caracteres`),
  name: z.string().trim().min(1, "Escribe tu nombre").max(80, "Máximo 80 caracteres"),
});

type FormValues = z.infer<typeof schema>;

type AmbiguousResult = Extract<UnirseResult, { status: "ambiguous" }>;

export function UnirseSalaForm({
  defaultCode,
  defaultName,
}: {
  defaultCode: string;
  defaultName: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [ambiguous, setAmbiguous] = useState<AmbiguousResult | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { code: defaultCode, name: defaultName },
  });

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      const result = await unirseSala(values);
      if (result?.status === "error") {
        toast.error(result.error);
      } else if (result?.status === "ambiguous") {
        setAmbiguous(result);
      }
    });
  };

  const onSelect = (participantId: string) => {
    if (!ambiguous) return;
    startTransition(async () => {
      const result = await elegirParticipante(ambiguous.code, participantId);
      if (result?.error) {
        toast.error(result.error);
      }
    });
  };

  if (ambiguous) {
    return (
      <div className="space-y-4">
        <p className="text-center text-sm text-muted-foreground">
          Encontramos a dos personas con ese nombre en la sala. ¿Cuál de ellas
          eres tú?
        </p>
        <div className="flex flex-col gap-3">
          {ambiguous.options.map((option) => (
            <Button
              key={option.id}
              type="button"
              variant="outline"
              size="lg"
              className="h-12 text-base"
              disabled={isPending}
              onClick={() => onSelect(option.id)}
            >
              {option.slot === "A"
                ? "La persona que creó la sala"
                : "La persona que se unió después"}
            </Button>
          ))}
        </div>
        <Button
          type="button"
          variant="ghost"
          className="w-full"
          disabled={isPending}
          onClick={() => setAmbiguous(null)}
        >
          Volver
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="code">Código de la sala</Label>
        <Input
          id="code"
          placeholder="Ej. AB12CD"
          className="h-11 text-center font-heading text-lg uppercase tracking-[0.3em]"
          maxLength={ROOM_CODE_LENGTH}
          aria-invalid={!!errors.code}
          {...register("code")}
        />
        {errors.code && <p className="text-sm text-destructive">{errors.code.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">Tu nombre</Label>
        <Input
          id="name"
          placeholder="Ej. Ana"
          className="h-11"
          aria-invalid={!!errors.name}
          {...register("name")}
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>
      <Button type="submit" size="lg" className="h-12 w-full text-base" disabled={isPending}>
        {isPending ? "Entrando..." : "Entrar a la sala"}
      </Button>
    </form>
  );
}
