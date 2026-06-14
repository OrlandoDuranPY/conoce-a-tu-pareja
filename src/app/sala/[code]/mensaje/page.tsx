import { redirect } from "next/navigation";
import { getRoomForParticipant } from "@/lib/auth";
import { hasAnsweredAllQuestions } from "@/lib/completion";
import { normalizeRoomCode } from "@/lib/room-code";
import { MensajeForm } from "./mensaje-form";

export default async function MensajePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code: rawCode } = await params;
  const code = normalizeRoomCode(rawCode);

  const data = await getRoomForParticipant(code);
  if (!data) redirect(`/unirse?code=${code}`);

  const { room, participant } = data;

  if (!hasAnsweredAllQuestions(participant, room.questions)) {
    redirect(`/sala/${room.code}/preguntas`);
  }
  if (participant.messageSubmittedAt !== null) {
    redirect(`/sala/${room.code}/resultados`);
  }

  const partner = room.participants.find((p) => p.id !== participant.id);
  const partnerName = partner?.name ?? room.partnerNamePreview ?? "tu pareja";

  return (
    <MensajeForm
      code={room.code}
      partnerName={partnerName}
      initialMessage={participant.message ?? ""}
      initialSignature={participant.signatureBase64 ?? ""}
    />
  );
}
