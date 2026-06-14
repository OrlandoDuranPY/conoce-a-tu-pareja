"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { normalizeRoomCode, ROOM_CODE_LENGTH } from "@/lib/room-code";

const unirseSchema = z.object({
  code: z
    .string()
    .trim()
    .length(ROOM_CODE_LENGTH, `El código debe tener ${ROOM_CODE_LENGTH} caracteres`),
  name: z.string().trim().min(1, "Escribe tu nombre").max(80, "Máximo 80 caracteres"),
});

export type UnirseInput = z.infer<typeof unirseSchema>;

export type UnirseResult =
  | { status: "error"; error: string }
  | { status: "ambiguous"; code: string; options: { id: string; slot: string }[] };

const COOKIE_MAX_AGE = 60 * 60 * 24 * 180; // 180 días

async function setParticipantCookie(code: string, participantId: string) {
  const cookieStore = await cookies();
  cookieStore.set(`cat_${code}`, participantId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}

export async function unirseSala(input: UnirseInput): Promise<UnirseResult> {
  const parsed = unirseSchema.safeParse(input);
  if (!parsed.success) {
    return { status: "error", error: parsed.error.issues[0]?.message ?? "Revisa los datos del formulario." };
  }
  const code = normalizeRoomCode(parsed.data.code);
  const name = parsed.data.name;
  const normalizedName = name.toLowerCase();

  const room = await prisma.room.findUnique({
    where: { code },
    include: { participants: true },
  });

  if (!room) {
    return {
      status: "error",
      error: "No encontramos una sala con ese código. Verifica que esté bien escrito.",
    };
  }

  const matches = room.participants.filter((p) => p.name.toLowerCase() === normalizedName);

  if (matches.length === 1) {
    await setParticipantCookie(code, matches[0].id);
    redirect(`/sala/${code}`);
  }

  if (matches.length >= 2) {
    return {
      status: "ambiguous",
      code,
      options: matches.map((m) => ({ id: m.id, slot: m.slot })),
    };
  }

  // Sin coincidencias: si hay un lugar libre en la sala, nos unimos como participante nuevo.
  if (room.participants.length < 2) {
    const usedSlots = new Set(room.participants.map((p) => p.slot));
    const slot = usedSlots.has("A") ? "B" : "A";

    const participant = await prisma.participant.create({
      data: { roomId: room.id, slot, name },
    });

    await setParticipantCookie(code, participant.id);
    redirect(`/sala/${code}`);
  }

  return {
    status: "error",
    error: "No encontramos tu nombre en esta sala. Verifica el código.",
  };
}

export async function elegirParticipante(code: string, participantId: string) {
  const normalizedCode = normalizeRoomCode(code);
  const room = await prisma.room.findUnique({
    where: { code: normalizedCode },
    include: { participants: true },
  });
  const participant = room?.participants.find((p) => p.id === participantId);

  if (!room || !participant) {
    return { error: "No pudimos verificar tu sesión. Intenta de nuevo." };
  }

  await setParticipantCookie(normalizedCode, participant.id);
  redirect(`/sala/${normalizedCode}`);
}
