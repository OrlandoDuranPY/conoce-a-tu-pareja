import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { normalizeRoomCode } from "@/lib/room-code";

/**
 * Resolución ligera de identidad para Server Actions: confirma que la cookie
 * `cat_<code>` corresponde a un participante real de la sala con ese código
 * (evita que una cookie de otra sala se reutilice aquí).
 */
export async function getParticipantLight(rawCode: string) {
  const code = normalizeRoomCode(rawCode);
  const cookieStore = await cookies();
  const participantId = cookieStore.get(`cat_${code}`)?.value;
  if (!participantId) return null;

  const participant = await prisma.participant.findUnique({
    where: { id: participantId },
    include: { room: true },
  });
  if (!participant || participant.room.code !== code) return null;

  return participant;
}

/**
 * Carga completa para páginas: la sala (con preguntas y ambos participantes
 * con sus respuestas) más el participante actual según la cookie.
 */
export async function getRoomForParticipant(rawCode: string) {
  const code = normalizeRoomCode(rawCode);
  const room = await prisma.room.findUnique({
    where: { code },
    include: {
      questions: { orderBy: { order: "asc" } },
      participants: { include: { answers: true }, orderBy: { slot: "asc" } },
    },
  });
  if (!room) return null;

  const cookieStore = await cookies();
  const participantId = cookieStore.get(`cat_${code}`)?.value;
  const participant = room.participants.find((p) => p.id === participantId);
  if (!participant) return null;

  return { room, participant, code };
}
