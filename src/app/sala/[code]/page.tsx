import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { getParticipantStatus } from "@/lib/completion";
import { prisma } from "@/lib/db";
import { normalizeRoomCode } from "@/lib/room-code";

export default async function SalaDispatcherPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code: rawCode } = await params;
  const code = normalizeRoomCode(rawCode);

  const room = await prisma.room.findUnique({
    where: { code },
    include: {
      questions: { orderBy: { order: "asc" } },
      participants: { include: { answers: { select: { questionId: true } } } },
    },
  });

  if (!room) notFound();

  const cookieStore = await cookies();
  const participantId = cookieStore.get(`cat_${code}`)?.value;
  const participant = room.participants.find((p) => p.id === participantId);

  if (!participant) {
    redirect(`/unirse?code=${code}`);
  }

  const status = getParticipantStatus(participant, room.questions);
  redirect(`/sala/${code}/${status}`);
}
