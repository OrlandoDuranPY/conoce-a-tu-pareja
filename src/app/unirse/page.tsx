import Link from "next/link";
import { ArrowLeft, KeyRound } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/db";
import { normalizeRoomCode } from "@/lib/room-code";
import { UnirseSalaForm } from "./unirse-sala-form";

export default async function UnirseSalaPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const params = await searchParams;
  const code = params.code ? normalizeRoomCode(params.code) : "";

  let defaultName = "";
  if (code) {
    const room = await prisma.room.findUnique({
      where: { code },
      select: { partnerNamePreview: true },
    });
    defaultName = room?.partnerNamePreview ?? "";
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Volver al inicio
      </Link>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 inline-flex size-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
            <KeyRound className="size-6" />
          </div>
          <CardTitle className="font-heading text-2xl">Unirme a una sala</CardTitle>
          <CardDescription>
            Escribe el código que te compartió tu pareja y tu nombre para
            entrar a su espacio.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UnirseSalaForm defaultCode={code} defaultName={defaultName} />
        </CardContent>
      </Card>
    </main>
  );
}
