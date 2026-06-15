import Link from "next/link";
import { HeartCrack } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
      <div className="seal mx-auto mb-4 inline-flex size-14 items-center justify-center rounded-full">
        <HeartCrack className="size-7" />
      </div>
      <h1 className="font-heading text-3xl font-bold text-foreground">
        No encontramos esta sala
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        Puede que el código esté mal escrito o que la sala ya no exista.
        Verifica con tu pareja y vuelve a intentarlo.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button
          size="lg"
          className="h-12 px-8 text-base"
          render={<Link href="/unirse" />}
          nativeButton={false}
        >
          Intentar de nuevo
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="h-12 px-8 text-base"
          render={<Link href="/" />}
          nativeButton={false}
        >
          Ir al inicio
        </Button>
      </div>
    </main>
  );
}
