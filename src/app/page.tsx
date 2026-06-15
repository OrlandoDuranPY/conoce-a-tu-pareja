import Link from "next/link";
import { Heart, KeyRound, MessageCircleHeart, NotebookPen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const STEPS = [
  {
    icon: NotebookPen,
    title: "1. Respondan a su ritmo",
    description:
      "Cada uno contesta las preguntas cuando quiera, sin necesidad de estar conectados al mismo tiempo. Su progreso se guarda solo.",
  },
  {
    icon: MessageCircleHeart,
    title: "2. Dejen una carta",
    description:
      "Al terminar, escriban un mensaje especial para la otra persona y firmen con su propio puño y letra.",
  },
  {
    icon: Heart,
    title: "3. Descubran sus coincidencias",
    description:
      "Cuando ambos terminen, vean sus respuestas lado a lado y descarguen un PDF para guardar el recuerdo.",
  },
];

export default function HomePage() {
  return (
    <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4 py-16 sm:py-24">
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 -right-24 hidden size-[28rem] rotate-[-12deg] text-primary/5 lg:block"
      >
        <path
          fill="currentColor"
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        />
      </svg>

      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm font-medium text-secondary-foreground ring-1 ring-seal/30">
          <Heart className="size-4 fill-current" />
          Para parejas curiosas
        </span>
        <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Conoce a tu{" "}
          <span className="font-script text-5xl text-primary sm:text-6xl lg:text-7xl">
            pareja
          </span>
        </h1>
        <p className="mt-4 max-w-md text-base text-muted-foreground sm:text-lg">
          Respondan preguntas divertidas y profundas a su propio ritmo,
          descubran cuánto se parecen y terminen con una carta especial para
          la otra persona.
        </p>

        <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Button
            size="lg"
            className="h-12 px-8 text-base"
            render={<Link href="/crear" />}
            nativeButton={false}
          >
            Crear una sala
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 px-8 text-base"
            render={<Link href="/unirse" />}
            nativeButton={false}
          >
            <KeyRound />
            Unirme con un código
          </Button>
        </div>
      </div>

      <div className="divider-stamps my-12 w-full max-w-3xl sm:my-16">
        <Heart className="size-4 fill-primary/40 text-primary/40" />
      </div>

      <div className="grid w-full max-w-5xl gap-4 sm:grid-cols-3 lg:gap-6">
        {STEPS.map(({ icon: Icon, title, description }) => (
          <Card key={title} className="text-left">
            <CardHeader>
              <div className="seal mb-2 inline-flex size-10 items-center justify-center rounded-full">
                <Icon className="size-5" />
              </div>
              <CardTitle className="text-base">{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
