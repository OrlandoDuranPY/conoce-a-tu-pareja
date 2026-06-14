"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { getParticipantLight } from "@/lib/auth";
import { prisma } from "@/lib/db";

const submitMessageSchema = z.object({
  message: z.string().trim().max(2000, "Máximo 2000 caracteres"),
  signatureBase64: z.string().refine(
    (value) => value === "" || /^data:image\/(png|jpe?g|webp);base64,/.test(value),
    { message: "Formato de imagen no válido." }
  ),
});

export type SubmitMessageInput = z.infer<typeof submitMessageSchema>;

export async function submitMessage(code: string, input: SubmitMessageInput) {
  const parsed = submitMessageSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const participant = await getParticipantLight(code);
  if (!participant) {
    return { error: "Tu sesión expiró. Vuelve a entrar a la sala." };
  }

  await prisma.participant.update({
    where: { id: participant.id },
    data: {
      message: parsed.data.message || null,
      signatureBase64: parsed.data.signatureBase64 || null,
      messageSubmittedAt: new Date(),
    },
  });

  redirect(`/sala/${participant.room.code}/resultados`);
}
