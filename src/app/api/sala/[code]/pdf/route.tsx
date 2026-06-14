import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { getRoomForParticipant } from "@/lib/auth";
import { isRoomComplete } from "@/lib/completion";
import { PdfDocument } from "@/lib/pdf-document";
import { normalizeRoomCode } from "@/lib/room-code";

export const runtime = "nodejs";

const ACCENTS: Record<string, string> = {
  á: "a", é: "e", í: "i", ó: "o", ú: "u", ü: "u", ñ: "n",
  Á: "A", É: "E", Í: "I", Ó: "O", Ú: "U", Ü: "U", Ñ: "N",
};

function slugifyName(name: string): string {
  return name
    .replace(/[áéíóúüñÁÉÍÓÚÜÑ]/g, (ch) => ACCENTS[ch] ?? ch)
    .replace(/[^a-zA-Z0-9.-]+/g, "-");
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code: rawCode } = await params;
  const code = normalizeRoomCode(rawCode);

  const data = await getRoomForParticipant(code);
  if (!data) {
    return NextResponse.json({ error: "Sala no encontrada." }, { status: 404 });
  }

  const { room } = data;

  if (!isRoomComplete(room.participants, room.questions)) {
    return NextResponse.json(
      { error: "Todavía no pueden descargar el PDF: falta que ambos terminen." },
      { status: 403 }
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

  const buffer = await renderToBuffer(
    <PdfDocument
      roomCode={room.code}
      participants={participants}
      questions={questions}
      generatedAt={new Date()}
    />
  );

  const [a, b] = participants;
  const filename = `conoce-a-tu-pareja-${slugifyName(a.name)}-${slugifyName(b.name)}.pdf`;

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
