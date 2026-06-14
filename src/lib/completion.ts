/**
 * Lógica de "completado" dinámica: nunca se guarda un flag estático en la BD.
 * Todo se recalcula a partir de las preguntas de la sala y las respuestas
 * existentes, así que el estado siempre refleja la realidad actual.
 *
 * Casos de borde importantes:
 * - Las preguntas pertenecen a la SALA, no a un participante: ambos deben
 *   responder TODAS (las 25 por defecto + las personalizadas que cualquiera
 *   agregue). `createdBySlot` en Question es solo metadata para mostrar
 *   crédito ("Pregunta añadida por...") en la revelación.
 * - Si alguien agrega una pregunta nueva DESPUÉS de que ambos terminaron,
 *   `isParticipantComplete` vuelve a `false` para los dos automáticamente
 *   (la pregunta nueva no tiene respuestas aún). Esto re-bloquea el PDF y
 *   vuelve a mostrar la sala de espera hasta que ambos respondan también
 *   esa(s) pregunta(s) nueva(s). `messageSubmittedAt` NO se borra, así que
 *   solo falta responder la(s) pregunta(s) pendiente(s).
 */

type ParticipantForCompletion = {
  messageSubmittedAt: Date | null;
  answers: { questionId: string }[];
};

type QuestionForCompletion = {
  id: string;
};

export type ParticipantStatus = "preguntas" | "mensaje" | "resultados";

/** IDs de preguntas que el participante aún no respondió, en el orden recibido. */
export function getUnansweredQuestionIds(
  participant: ParticipantForCompletion,
  questions: QuestionForCompletion[]
): string[] {
  const answeredIds = new Set(participant.answers.map((a) => a.questionId));
  return questions.filter((q) => !answeredIds.has(q.id)).map((q) => q.id);
}

export function hasAnsweredAllQuestions(
  participant: ParticipantForCompletion,
  questions: QuestionForCompletion[]
): boolean {
  if (questions.length === 0) return false;
  return getUnansweredQuestionIds(participant, questions).length === 0;
}

/** Completo = respondió todas las preguntas de la sala Y ya envió su mensaje/firma. */
export function isParticipantComplete(
  participant: ParticipantForCompletion,
  questions: QuestionForCompletion[]
): boolean {
  return (
    hasAnsweredAllQuestions(participant, questions) &&
    participant.messageSubmittedAt !== null
  );
}

/** La sala está completa cuando existen ambos participantes y ambos están completos. */
export function isRoomComplete(
  participants: ParticipantForCompletion[],
  questions: QuestionForCompletion[]
): boolean {
  return (
    participants.length === 2 &&
    participants.every((p) => isParticipantComplete(p, questions))
  );
}

/**
 * Estado de un participante para que el dispatcher decida a dónde redirigir:
 * - "preguntas": le faltan preguntas por responder (o la sala no tiene preguntas).
 * - "mensaje": respondió todo pero no ha enviado mensaje/firma.
 * - "resultados": completó todo.
 */
export function getParticipantStatus(
  participant: ParticipantForCompletion,
  questions: QuestionForCompletion[]
): ParticipantStatus {
  if (!hasAnsweredAllQuestions(participant, questions)) return "preguntas";
  if (participant.messageSubmittedAt === null) return "mensaje";
  return "resultados";
}

/** Primera pregunta sin responder (en el orden recibido), o null si ya respondió todas. */
export function getFirstUnansweredQuestion<Q extends QuestionForCompletion>(
  questions: Q[],
  participant: ParticipantForCompletion
): Q | null {
  const answeredIds = new Set(participant.answers.map((a) => a.questionId));
  return questions.find((q) => !answeredIds.has(q.id)) ?? null;
}
