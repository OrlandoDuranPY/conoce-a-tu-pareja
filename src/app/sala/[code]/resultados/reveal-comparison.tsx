"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import { Download, Heart } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type RevealParticipant = {
  id: string;
  name: string;
  message: string | null;
  signatureBase64: string | null;
};

export type RevealQuestion = {
  id: string;
  text: string;
  answers: { participantId: string; text: string }[];
};

function getInitials(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
  return initials || "?";
}

function normalize(text: string) {
  return text.trim().toLowerCase();
}

const CONFETTI_COLORS = ["#fb7185", "#f472b6", "#fda4af", "#f43f5e"];

export function RevealComparison({
  code,
  participants,
  questions,
}: {
  code: string;
  participants: RevealParticipant[];
  questions: RevealQuestion[];
}) {
  useEffect(() => {
    confetti({
      particleCount: 80,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.6 },
      colors: CONFETTI_COLORS,
    });
    confetti({
      particleCount: 80,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.6 },
      colors: CONFETTI_COLORS,
    });
  }, []);

  const [a, b] = participants;

  return (
    <main className="flex flex-1 flex-col items-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-3xl space-y-6">
        <div className="text-center">
          <Badge variant="seal" className="mb-2">
            <Heart className="fill-primary text-primary" />
            ¡Lo lograron!
          </Badge>
          <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
            {a.name} &amp; {b.name}
          </h1>
          <p className="mx-auto mt-2 max-w-md text-muted-foreground">
            Aquí están todas sus respuestas, una junto a la otra. Cuando
            ambos pensaron lo mismo, lo marcamos con un{" "}
            <Heart className="inline size-4 fill-primary text-primary" />.
          </p>
        </div>

        <div className="space-y-4">
          {questions.map((question) => {
            const answerA =
              question.answers.find((ans) => ans.participantId === a.id)?.text ?? "";
            const answerB =
              question.answers.find((ans) => ans.participantId === b.id)?.text ?? "";
            const isMatch =
              normalize(answerA).length > 0 && normalize(answerA) === normalize(answerB);

            return (
              <Card key={question.id} className={cn(isMatch && "bg-match/50 ring-2 ring-match")}>
                <CardHeader>
                  <CardTitle className="flex items-start gap-2 text-lg">
                    <span className="flex-1">{question.text}</span>
                    {isMatch && (
                      <Heart className="mt-0.5 size-4 shrink-0 fill-primary text-primary" />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3 sm:grid-cols-2">
                  <AnswerBlock name={a.name} text={answerA} />
                  <AnswerBlock name={b.name} text={answerB} />
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="divider-stamps">
          <Heart className="size-4 fill-primary/40 text-primary/40" />
        </div>

        <div className="text-center">
          <h2 className="font-script text-3xl text-primary">Cartas para guardar</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {participants.map((p) => (
            <Card key={p.id} className="letter-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Avatar size="sm">
                    <AvatarFallback className="bg-seal font-heading font-semibold text-seal-foreground">
                      {getInitials(p.name)}
                    </AvatarFallback>
                  </Avatar>
                  Mensaje de {p.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {p.message ? (
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{p.message}</p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    {p.name} no dejó un mensaje escrito.
                  </p>
                )}
                {p.signatureBase64 && (
                  <div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.signatureBase64}
                      alt={`Firma de ${p.name}`}
                      className="h-20 max-w-full object-contain"
                    />
                    <p className="font-script text-lg text-primary">{p.name}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center pb-8">
          <Button
            render={<a href={`/api/sala/${code}/pdf`} />}
            nativeButton={false}
            size="lg"
            className="h-12 gap-2 px-8 text-base"
          >
            <Download className="size-4" />
            Descargar PDF
          </Button>
        </div>
      </div>
    </main>
  );
}

function AnswerBlock({ name, text }: { name: string; text: string }) {
  return (
    <div className="rounded-lg bg-muted/50 p-3">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {name}
      </p>
      <p className="text-sm leading-relaxed">{text}</p>
    </div>
  );
}
