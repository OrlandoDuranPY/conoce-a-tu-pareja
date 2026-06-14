import { redirect } from "next/navigation";
import { getRoomForParticipant } from "@/lib/auth";
import { getFirstUnansweredQuestion, hasAnsweredAllQuestions } from "@/lib/completion";
import { RONDA_1_COUNT } from "@/lib/default-questions";
import { normalizeRoomCode } from "@/lib/room-code";
import { QuestionFlow } from "./question-flow";

export default async function PreguntasPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code: rawCode } = await params;
  const code = normalizeRoomCode(rawCode);

  const data = await getRoomForParticipant(code);
  if (!data) redirect(`/unirse?code=${code}`);

  const { room, participant } = data;

  if (hasAnsweredAllQuestions(participant, room.questions)) {
    redirect(`/sala/${room.code}/mensaje`);
  }

  const initialAnswers = Object.fromEntries(
    participant.answers.map((a) => [a.questionId, a.text])
  );
  const firstUnanswered = getFirstUnansweredQuestion(room.questions, participant);

  return (
    <QuestionFlow
      code={room.code}
      questions={room.questions.map((q) => ({
        id: q.id,
        text: q.text,
        order: q.order,
        isCustom: q.isCustom,
        createdBySlot: q.createdBySlot,
      }))}
      initialAnswers={initialAnswers}
      initialQuestionId={firstUnanswered?.id ?? room.questions[0].id}
      rondaUnoCount={RONDA_1_COUNT}
      participantSlot={participant.slot}
    />
  );
}
