"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { addCustomQuestion, type NewQuestionDTO } from "./actions";

const schema = z.object({
  text: z.string().trim().min(1, "Escribe una pregunta").max(300, "Máximo 300 caracteres"),
});

type FormValues = z.infer<typeof schema>;

export function AddQuestionDialog({
  code,
  onCreated,
}: {
  code: string;
  onCreated: (question: NewQuestionDTO) => void;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { text: "" } });

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      const result = await addCustomQuestion(code, values);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      onCreated(result.question);
      toast.success("¡Listo! Tu pareja también deberá responder esta pregunta.");
      reset();
      setOpen(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button type="button" variant="ghost" size="sm" />}>
        <Plus className="size-4" />
        Añadir una pregunta
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Añade tu propia pregunta</DialogTitle>
          <DialogDescription>
            Se agregará al final para los dos. Tu pareja también deberá
            responderla.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-question-text">Tu pregunta</Label>
            <Textarea
              id="new-question-text"
              rows={3}
              placeholder="Ej. ¿Cuál fue tu primer recuerdo conmigo?"
              aria-invalid={!!errors.text}
              {...register("text")}
            />
            {errors.text && <p className="text-sm text-destructive">{errors.text.message}</p>}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending} className="h-11 w-full text-base">
              {isPending ? "Agregando..." : "Agregar pregunta"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
