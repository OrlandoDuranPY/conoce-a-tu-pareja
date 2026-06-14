import { redirect } from "next/navigation";
import { getRoomForParticipant } from "@/lib/auth";
import { getParticipantStatus, isParticipantComplete } from "@/lib/completion";
import { normalizeRoomCode } from "@/lib/room-code";
import { RevealComparison } from "./reveal-comparison";
import { WaitingRoom } from "./waiting-room";

export default async function ResultadosPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code: rawCode } = await params;
  const code = normalizeRoomCode(rawCode);

  const data = await getRoomForParticipant(code);
  if (!data) redirect(`/unirse?code=${code}`);

  const { room, participant } = data;

  const status = getParticipantStatus(participant, room.questions);
  if (status !== "resultados") {
    redirect(`/sala/${room.code}/${status}`);
  }

  const partner = room.participants.find((p) => p.id !== participant.id) ?? null;

  if (!partner) {
    return (
      <WaitingRoom
        title="¡Ya terminaste! 🎉"
        message={`Tu pareja todavía no se ha unido a la sala. Comparte el código ${room.code} para que pueda comenzar a responder.`}
      />
    );
  }

  if (!isParticipantComplete(partner, room.questions)) {
    return (
      <WaitingRoom
        title="¡Ya terminaste! 🎉"
        message={`${partner.name} aún no termina de contestar todas sus preguntas. Vuelve pronto, esto vale la espera 💕`}
      />
    );
  }

  const participants = room.participants.map((p) => ({
    id: p.id,
    name: p.name,
    message: p.message,
    signatureBase64: p.signatureBase64,
  }));

  const questions = room.questions.map((q) => ({
    id: q.id,
    text: q.text,
    answers: room.participants.map((p) => ({
      participantId: p.id,
      text: p.answers.find((a) => a.questionId === q.id)?.text ?? "",
    })),
  }));

  return <RevealComparison code={room.code} participants={participants} questions={questions} />;
}
