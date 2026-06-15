import "dotenv/config";
import { PrismaClient } from "./src/generated/prisma/client.js";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD ?? "",
  database: process.env.DB_NAME || "conoce_a_tu_pareja",
});
const prisma = new PrismaClient({ adapter });

const PIXEL_PNG =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";

const code = "KDWPJQ";

const room = await prisma.room.findUnique({
  where: { code },
  include: {
    participants: { include: { answers: true } },
    questions: { orderBy: { order: "asc" } },
  },
});

if (!room) {
  throw new Error(`Room ${code} not found`);
}

const a = room.participants.find((p) => p.slot === "A");
if (!a) throw new Error("Participant A not found");
if (room.participants.some((p) => p.slot === "B")) {
  throw new Error("Participant B already exists");
}

const aAnswerByQuestion = new Map(a.answers.map((ans) => [ans.questionId, ans.text]));

const b = await prisma.participant.create({
  data: {
    roomId: room.id,
    slot: "B",
    name: "Ana",
    message:
      "Carlos, no tengo palabras para describir lo feliz que me haces. ¡Gracias por ser tú!",
    signatureBase64: PIXEL_PNG,
    messageSubmittedAt: new Date(),
  },
});

for (const question of room.questions) {
  const aText = aAnswerByQuestion.get(question.id) ?? "";
  // Make question 1 (color) and the custom question match A's answer exactly
  // (case-different for Q1, to verify normalized matching) to exercise the
  // reveal page's match-highlight rendering.
  let text;
  if (question.order === 1) {
    text = aText.toLowerCase();
  } else if (question.isCustom) {
    text = aText;
  } else {
    text = `Respuesta de Ana - ${question.order}`;
  }

  await prisma.answer.create({
    data: {
      questionId: question.id,
      participantId: b.id,
      text,
    },
  });
}

console.log("Participant B (Ana) seeded with", room.questions.length, "answers.");
await prisma.$disconnect();
