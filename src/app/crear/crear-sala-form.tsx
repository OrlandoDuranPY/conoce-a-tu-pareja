"use client";

import { useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { crearSala } from "./actions";

const schema = z.object({
  yourName: z.string().trim().min(1, "Escribe tu nombre").max(80, "Máximo 80 caracteres"),
  partnerName: z
    .string()
    .trim()
    .min(1, "Escribe el nombre de tu pareja")
    .max(80, "Máximo 80 caracteres"),
});

type FormValues = z.infer<typeof schema>;

export function CrearSalaForm() {
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { yourName: "", partnerName: "" },
  });

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      const result = await crearSala(values);
      if (result?.error) {
        toast.error(result.error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="yourName">Tu nombre</Label>
        <Input
          id="yourName"
          placeholder="Ej. Ana"
          className="h-11"
          aria-invalid={!!errors.yourName}
          {...register("yourName")}
        />
        {errors.yourName && (
          <p className="text-sm text-destructive">{errors.yourName.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="partnerName">Nombre de tu pareja</Label>
        <Input
          id="partnerName"
          placeholder="Ej. Luis"
          className="h-11"
          aria-invalid={!!errors.partnerName}
          {...register("partnerName")}
        />
        {errors.partnerName && (
          <p className="text-sm text-destructive">{errors.partnerName.message}</p>
        )}
      </div>
      <Button type="submit" size="lg" className="h-12 w-full text-base" disabled={isPending}>
        {isPending ? "Creando su sala..." : "Crear nuestra sala"}
      </Button>
    </form>
  );
}
