import Link from "next/link";
import { Heart } from "lucide-react";
import { normalizeRoomCode } from "@/lib/room-code";
import { RoomCodeBadge } from "./room-code-badge";

export default async function SalaLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ code: string }>;
}) {
  const { code: rawCode } = await params;
  const code = normalizeRoomCode(rawCode);

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center justify-between border-b border-dashed border-border px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-script text-xl text-primary transition-opacity hover:opacity-80"
        >
          <Heart className="size-4 fill-primary" />
          Conoce a tu pareja
        </Link>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="hidden sm:inline">Código de tu sala:</span>
          <RoomCodeBadge code={code} />
        </div>
      </header>
      {children}
    </div>
  );
}
