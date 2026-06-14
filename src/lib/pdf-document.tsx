import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

export type PdfParticipant = {
  id: string;
  name: string;
  message: string | null;
  signatureBase64: string | null;
};

export type PdfQuestion = {
  id: string;
  text: string;
  answers: { participantId: string; text: string }[];
};

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, fontFamily: "Helvetica", color: "#3a2630" },
  title: { fontSize: 22, fontFamily: "Helvetica-Bold", marginBottom: 4, color: "#c0265a" },
  subtitle: { fontSize: 10, color: "#a3536b", marginBottom: 18 },
  questionBlock: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 4,
    backgroundColor: "#fdf2f5",
  },
  questionBlockMatch: { backgroundColor: "#fde2e9" },
  questionText: { fontSize: 11, fontFamily: "Helvetica-Bold", marginBottom: 6 },
  answerRow: { flexDirection: "row" },
  answerCol: { flex: 1, marginRight: 10 },
  answerColLast: { flex: 1 },
  answerName: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#a3536b",
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  answerText: { fontSize: 10, lineHeight: 1.4 },
  matchBadge: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#c0265a", marginTop: 6 },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    marginTop: 16,
    marginBottom: 10,
    color: "#c0265a",
  },
  messageBlock: {
    marginBottom: 14,
    padding: 12,
    borderRadius: 4,
    backgroundColor: "#fdf2f5",
  },
  messageAuthor: { fontSize: 11, fontFamily: "Helvetica-Bold", marginBottom: 6 },
  messageText: { fontSize: 10, lineHeight: 1.5, marginBottom: 8 },
  signatureImage: { width: 160, height: 60, objectFit: "contain", marginBottom: 4 },
  signatureName: { fontSize: 11, fontFamily: "Helvetica-Oblique" },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    fontSize: 8,
    color: "#cba0ab",
    textAlign: "center",
  },
});

function normalize(text: string) {
  return text.trim().toLowerCase();
}

export function PdfDocument({
  roomCode,
  participants,
  questions,
  generatedAt,
}: {
  roomCode: string;
  participants: PdfParticipant[];
  questions: PdfQuestion[];
  generatedAt: Date;
}) {
  const [a, b] = participants;
  const dateLabel = generatedAt.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Document title={`Conoce a tu pareja - ${a.name} y ${b.name}`}>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Conoce a tu pareja</Text>
        <Text style={styles.subtitle}>
          {a.name} &amp; {b.name} · Sala {roomCode} · {dateLabel}
        </Text>

        {questions.map((question, index) => {
          const answerA = question.answers.find((ans) => ans.participantId === a.id)?.text ?? "";
          const answerB = question.answers.find((ans) => ans.participantId === b.id)?.text ?? "";
          const isMatch = normalize(answerA).length > 0 && normalize(answerA) === normalize(answerB);

          return (
            <View
              key={question.id}
              style={isMatch ? [styles.questionBlock, styles.questionBlockMatch] : styles.questionBlock}
            >
              <Text style={styles.questionText}>
                {index + 1}. {question.text}
              </Text>
              <View style={styles.answerRow}>
                <View style={styles.answerCol}>
                  <Text style={styles.answerName}>{a.name}</Text>
                  <Text style={styles.answerText}>{answerA}</Text>
                </View>
                <View style={styles.answerColLast}>
                  <Text style={styles.answerName}>{b.name}</Text>
                  <Text style={styles.answerText}>{answerB}</Text>
                </View>
              </View>
              {isMatch && <Text style={styles.matchBadge}>♥ Coincidieron</Text>}
            </View>
          );
        })}

        <Text style={styles.sectionTitle}>Mensajes para la otra persona</Text>
        {participants.map((p) => (
          <View key={p.id} style={styles.messageBlock}>
            <Text style={styles.messageAuthor}>De parte de {p.name}:</Text>
            <Text style={styles.messageText}>
              {p.message?.trim() ? p.message : "(No dejó un mensaje escrito)"}
            </Text>
            {p.signatureBase64 && (
              // eslint-disable-next-line jsx-a11y/alt-text -- @react-pdf/renderer's Image has no alt prop
              <Image style={styles.signatureImage} src={p.signatureBase64} />
            )}
            <Text style={styles.signatureName}>{p.name}</Text>
          </View>
        ))}

        <Text
          style={styles.footer}
          fixed
          render={({ pageNumber, totalPages }) => `Conoce a tu pareja · Página ${pageNumber} de ${totalPages}`}
        />
      </Page>
    </Document>
  );
}
