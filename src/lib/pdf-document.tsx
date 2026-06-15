import path from "node:path";
import {
  Circle,
  Defs,
  Document,
  Font,
  Image,
  Page,
  Path,
  Polygon,
  RadialGradient,
  StyleSheet,
  Stop,
  Svg,
  Text,
  View,
} from "@react-pdf/renderer";

const fontsDir = path.join(process.cwd(), "public", "fonts", "pdf");
const fontFile = (file: string) => path.join(fontsDir, file);

Font.register({
  family: "Playfair Display",
  fonts: [
    { src: fontFile("PlayfairDisplay-Regular.woff"), fontWeight: 400 },
    { src: fontFile("PlayfairDisplay-Bold.woff"), fontWeight: 700 },
    { src: fontFile("PlayfairDisplay-ExtraBold.woff"), fontWeight: 800 },
  ],
});

Font.register({
  family: "Nunito",
  fonts: [
    { src: fontFile("Nunito-Regular.woff"), fontWeight: 400 },
    { src: fontFile("Nunito-SemiBold.woff"), fontWeight: 600 },
    { src: fontFile("Nunito-Bold.woff"), fontWeight: 700 },
  ],
});

Font.register({
  family: "Dancing Script",
  fonts: [
    { src: fontFile("DancingScript-Medium.woff"), fontWeight: 500 },
    { src: fontFile("DancingScript-Bold.woff"), fontWeight: 700 },
  ],
});

// Hex equivalents of the app's OKLCH design tokens (globals.css), since
// @react-pdf/renderer only understands hex/rgb/hsl colors.
const colors = {
  background: "#fff8f7",
  foreground: "#492829",
  card: "#fffcfc",
  primary: "#e93959",
  primaryForeground: "#fffafa",
  primaryLight: "#ff6f7c",
  primaryDark: "#b61441",
  secondaryForeground: "#a73447",
  muted: "#feeded",
  mutedForeground: "#886968",
  accentForeground: "#a7203f",
  border: "#f5d5d6",
  match: "#ffdfe5",
  seal: "#e5ac4c",
  sealForeground: "#7e4500",
};

const HEART_PATH =
  "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";

function HeartIcon({
  size = 10,
  color = colors.primary,
  opacity = 1,
}: {
  size?: number;
  color?: string;
  opacity?: number;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d={HEART_PATH} fill={color} opacity={opacity} />
    </Svg>
  );
}

// Wax-seal medallion: mirrors the `.seal` utility (radial gradient "wax"
// disc with a dashed gold ring and an embossed heart) used throughout the app.
function SealEmblem({ size = 40 }: { size?: number }) {
  const r = size / 2;
  const heartSize = size * 0.4;
  const heartOffset = (size - heartSize) / 2;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Defs>
        <RadialGradient id="sealWax" cx="35%" cy="30%" r="75%">
          <Stop offset="0%" stopColor={colors.primaryLight} />
          <Stop offset="55%" stopColor={colors.primary} />
          <Stop offset="100%" stopColor={colors.primaryDark} />
        </RadialGradient>
      </Defs>
      <Circle cx={r} cy={r} r={r - 1} stroke={colors.seal} strokeWidth={1.5} strokeDasharray="3 2.5" fill="none" />
      <Circle cx={r} cy={r} r={r - 4} fill="url(#sealWax)" />
      <Path
        d={HEART_PATH}
        fill={colors.primaryForeground}
        transform={`translate(${heartOffset} ${heartOffset}) scale(${heartSize / 24})`}
      />
    </Svg>
  );
}

// Dashed divider with a small heart, mirroring the `.divider-stamps`
// "perforated ticket" utility.
function DividerStamps() {
  return (
    <View style={styles.divider}>
      <View style={styles.dividerLine} />
      <HeartIcon size={9} color={colors.primary} opacity={0.4} />
      <View style={styles.dividerLine} />
    </View>
  );
}

// Folded paper corner overlay, mirroring the `.letter-card` dog-ear.
function FoldedCorner() {
  return (
    <Svg style={styles.fold} width={18} height={18} viewBox="0 0 18 18">
      <Polygon points="18,0 18,18 0,0" fill={colors.background} />
    </Svg>
  );
}

function getInitials(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
  return initials || "?";
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: "Nunito",
    color: colors.foreground,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  headerText: { flex: 1, paddingRight: 12 },
  title: {
    fontSize: 24,
    fontFamily: "Playfair Display",
    fontWeight: 800,
    color: colors.primary,
    marginBottom: 4,
  },
  subtitle: { fontSize: 10, fontFamily: "Nunito", fontWeight: 600, color: colors.mutedForeground },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginVertical: 14,
  },
  dividerLine: {
    flexGrow: 1,
    height: 0,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    borderTopStyle: "dashed",
  },
  questionBlock: {
    position: "relative",
    marginBottom: 10,
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.muted,
    borderLeftWidth: 3,
    borderLeftColor: "transparent",
  },
  questionBlockMatch: {
    backgroundColor: colors.match,
    borderLeftColor: colors.primary,
  },
  questionText: {
    fontSize: 12,
    fontFamily: "Playfair Display",
    fontWeight: 700,
    marginBottom: 7,
    color: colors.foreground,
  },
  answerRow: { flexDirection: "row" },
  answerCol: { flex: 1, marginRight: 10 },
  answerColLast: { flex: 1 },
  answerName: {
    fontSize: 8,
    fontFamily: "Nunito",
    fontWeight: 700,
    color: colors.accentForeground,
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  answerText: { fontSize: 10, lineHeight: 1.4, fontFamily: "Nunito", fontWeight: 400 },
  matchBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 8,
  },
  matchBadgeText: { fontSize: 9, fontFamily: "Nunito", fontWeight: 700, color: colors.primary },
  sectionTitle: {
    fontSize: 26,
    fontFamily: "Dancing Script",
    fontWeight: 700,
    marginBottom: 12,
    color: colors.primary,
    textAlign: "center",
  },
  messageBlock: {
    position: "relative",
    overflow: "hidden",
    marginBottom: 14,
    padding: 14,
    borderRadius: 8,
    backgroundColor: colors.muted,
  },
  fold: { position: "absolute", top: 0, right: 0 },
  messageHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  messageAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.seal,
    alignItems: "center",
    justifyContent: "center",
  },
  messageAvatarText: {
    fontSize: 9,
    fontFamily: "Playfair Display",
    fontWeight: 700,
    color: colors.sealForeground,
  },
  messageAuthor: { fontSize: 12, fontFamily: "Playfair Display", fontWeight: 700, color: colors.foreground },
  messageText: { fontSize: 10, lineHeight: 1.5, marginBottom: 10, fontFamily: "Nunito", fontWeight: 400 },
  signatureImage: { width: 150, height: 56, objectFit: "contain", marginBottom: 4 },
  signatureName: { fontSize: 15, fontFamily: "Dancing Script", fontWeight: 700, color: colors.primary },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 40,
    right: 40,
  },
  footerDivider: {
    height: 0,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    borderTopStyle: "dashed",
    marginBottom: 6,
  },
  footerText: {
    fontSize: 8,
    fontFamily: "Nunito",
    fontWeight: 400,
    color: colors.mutedForeground,
    textAlign: "center",
  },
});

function normalize(text: string) {
  return text.trim().toLowerCase();
}

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
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.title}>Conoce a tu pareja</Text>
            <Text style={styles.subtitle}>
              {a.name} &amp; {b.name} · Sala {roomCode} · {dateLabel}
            </Text>
          </View>
          <SealEmblem />
        </View>

        <DividerStamps />

        {questions.map((question, index) => {
          const answerA = question.answers.find((ans) => ans.participantId === a.id)?.text ?? "";
          const answerB = question.answers.find((ans) => ans.participantId === b.id)?.text ?? "";
          const isMatch = normalize(answerA).length > 0 && normalize(answerA) === normalize(answerB);

          return (
            <View
              key={question.id}
              wrap={false}
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
              {isMatch && (
                <View style={styles.matchBadge}>
                  <HeartIcon size={9} />
                  <Text style={styles.matchBadgeText}>Coincidieron</Text>
                </View>
              )}
            </View>
          );
        })}

        <DividerStamps />
        <Text style={styles.sectionTitle}>Cartas para guardar</Text>

        {participants.map((p) => (
          <View key={p.id} wrap={false} style={styles.messageBlock}>
            <FoldedCorner />
            <View style={styles.messageHeader}>
              <View style={styles.messageAvatar}>
                <Text style={styles.messageAvatarText}>{getInitials(p.name)}</Text>
              </View>
              <Text style={styles.messageAuthor}>Mensaje de {p.name}</Text>
            </View>
            <Text style={styles.messageText}>
              {p.message?.trim() ? p.message : `${p.name} no dejó un mensaje escrito.`}
            </Text>
            {p.signatureBase64 && (
              // eslint-disable-next-line jsx-a11y/alt-text -- @react-pdf/renderer's Image has no alt prop
              <Image style={styles.signatureImage} src={p.signatureBase64} />
            )}
            <Text style={styles.signatureName}>{p.name}</Text>
          </View>
        ))}

        <View style={styles.footer} fixed>
          <View style={styles.footerDivider} />
          <Text
            style={styles.footerText}
            render={({ pageNumber, totalPages }) => `Conoce a tu pareja · Página ${pageNumber} de ${totalPages}`}
          />
        </View>
      </Page>
    </Document>
  );
}
