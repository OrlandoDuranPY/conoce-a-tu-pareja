"use server";

import { z } from "zod";
import { getParticipantLight } from "@/lib/auth";
import { prisma } from "@/lib/db";

const saveAnswerSchema = z.object({
  questionId: z.string().min(1),
  text: z
    .string()
    .trim()
    .min(1, "Escribe una respuesta para continuar")
    .max(2000, "Máximo 2000 caracteres"),
});

export type SaveAnswerInput = z.infer<typeof saveAnswerSchema>;

export async function saveAnswer(
  code: string,
  input: SaveAnswerInput
): Promise<{ ok: true } | { ok: false; error: string }> {
  const parsed = saveAnswerSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const participant = await getParticipantLight(code);
  if (!participant) {
    return { ok: false, error: "Tu sesión expiró. Vuelve a entrar a la sala." };
  }

  const question = await prisma.question.findUnique({ where: { id: parsed.data.questionId } });
  if (!question || question.roomId !== participant.roomId) {
    return { ok: false, error: "Esta pregunta ya no existe." };
  }

  await prisma.answer.upsert({
    where: {
      questionId_participantId: {
        questionId: question.id,
        participantId: participant.id,
      },
    },
    create: {
      questionId: question.id,
      participantId: participant.id,
      text: parsed.data.text,
    },
    update: { text: parsed.data.text },
  });

  return { ok: true };
}

const addQuestionSchema = z.object({
  text: z.string().trim().min(1, "Escribe una pregunta").max(300, "Máximo 300 caracteres"),
});

export type AddQuestionInput = z.infer<typeof addQuestionSchema>;

export type NewQuestionDTO = {
  id: string;
  text: string;
  order: number;
  isCustom: boolean;
  createdBySlot: string | null;
};

export async function addCustomQuestion(
  code: string,
  input: AddQuestionInput
): Promise<{ ok: true; question: NewQuestionDTO } | { ok: false; error: string }> {
  const parsed = addQuestionSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const participant = await getParticipantLight(code);
  if (!participant) {
    return { ok: false, error: "Tu sesión expiró. Vuelve a entrar a la sala." };
  }

  const question = await prisma.$transaction(async (tx) => {
    const last = await tx.question.findFirst({
      where: { roomId: participant.roomId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    return tx.question.create({
      data: {
        roomId: participant.roomId,
        text: parsed.data.text,
        order: (last?.order ?? 0) + 1,
        isCustom: true,
        createdBySlot: participant.slot,
      },
    });
  });

  return {
    ok: true,
    question: {
      id: question.id,
      text: question.text,
      order: question.order,
      isCustom: question.isCustom,
      createdBySlot: question.createdBySlot,
    },
  };
}
