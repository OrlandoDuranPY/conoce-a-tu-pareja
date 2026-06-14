"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { DEFAULT_QUESTIONS } from "@/lib/default-questions";
import { generateRoomCode } from "@/lib/room-code";

const crearSalaSchema = z.object({
  yourName: z.string().trim().min(1, "Escribe tu nombre").max(80, "Máximo 80 caracteres"),
  partnerName: z
    .string()
    .trim()
    .min(1, "Escribe el nombre de tu pareja")
    .max(80, "Máximo 80 caracteres"),
});

export type CrearSalaInput = z.infer<typeof crearSalaSchema>;

const MAX_CODE_ATTEMPTS = 10;
const COOKIE_MAX_AGE = 60 * 60 * 24 * 180; // 180 días

export async function crearSala(input: CrearSalaInput) {
  const parsed = crearSalaSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Revisa los datos del formulario." };
  }
  const { yourName, partnerName } = parsed.data;

  let code: string | null = null;
  for (let i = 0; i < MAX_CODE_ATTEMPTS; i++) {
    const candidate = generateRoomCode();
    const existing = await prisma.room.findUnique({ where: { code: candidate } });
    if (!existing) {
      code = candidate;
      break;
    }
  }
  if (!code) {
    return { error: "No pudimos generar un código de sala. Intenta de nuevo." };
  }
  const roomCode = code;

  const participant = await prisma.$transaction(async (tx) => {
    const room = await tx.room.create({
      data: {
        code: roomCode,
        partnerNamePreview: partnerName,
        questions: {
          create: DEFAULT_QUESTIONS.map((text, index) => ({
            text,
            order: index + 1,
            isCustom: false,
          })),
        },
      },
    });

    return tx.participant.create({
      data: {
        roomId: room.id,
        slot: "A",
        name: yourName,
      },
    });
  });

  const cookieStore = await cookies();
  cookieStore.set(`cat_${roomCode}`, participant.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });

  redirect(`/sala/${roomCode}`);
}
