"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { AddQuestionDialog } from "./add-question-dialog";
import { ProgressHearts } from "./progress-hearts";
import { RoundInterstitial } from "./round-interstitial";
import { saveAnswer, type NewQuestionDTO } from "./actions";

export type FlowQuestion = {
  id: string;
  text: string;
  order: number;
  isCustom: boolean;
  createdBySlot: string | null;
};

const cardVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -60 : 60, opacity: 0 }),
};

export function QuestionFlow({
  code,
  questions: initialQuestions,
  initialAnswers,
  initialQuestionId,
  rondaUnoCount,
  participantSlot,
}: {
  code: string;
  questions: FlowQuestion[];
  initialAnswers: Record<string, string>;
  initialQuestionId: string;
  rondaUnoCount: number;
  participantSlot: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [questions, setQuestions] = useState(initialQuestions);
  const [answers, setAnswers] = useState(initialAnswers);
  const [index, setIndex] = useState(() => {
    const i = initialQuestions.findIndex((q) => q.id === initialQuestionId);
    return i === -1 ? 0 : i;
  });
  const [direction, setDirection] = useState(1);
  const [showInterstitial, setShowInterstitial] = useState(false);

  const currentQuestion = questions[index];
  const currentAnswer = answers[currentQuestion.id] ?? "";
  const isLast = index === questions.length - 1;

  const advance = () => {
    if (currentQuestion.order === rondaUnoCount && !isLast) {
      setShowInterstitial(true);
      return;
    }
    if (isLast) {
      router.push(`/sala/${code}/mensaje`);
      return;
    }
    setDirection(1);
    setIndex((i) => i + 1);
  };

  const handleNext = () => {
    const text = currentAnswer.trim();
    if (!text) return;
    startTransition(async () => {
      const result = await saveAnswer(code, { questionId: currentQuestion.id, text });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      advance();
    });
  };

  const handlePrev = () => {
    if (index === 0) return;
    setDirection(-1);
    setIndex((i) => i - 1);
  };

  const handleInterstitialContinue = () => {
    setShowInterstitial(false);
    setDirection(1);
    setIndex((i) => i + 1);
  };

  const handleQuestionCreated = (question: NewQuestionDTO) => {
    setQuestions((prev) => [...prev, question]);
  };

  return (
    <main className="flex flex-1 flex-col items-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-md sm:max-w-lg">
        <div className="mb-6">
          <ProgressHearts current={index + 1} total={questions.length} />
        </div>

        <AnimatePresence mode="wait" initial={false} custom={direction}>
          {showInterstitial ? (
            <RoundInterstitial key="interstitial" onContinue={handleInterstitialContinue} />
          ) : (
            <motion.div
              key={currentQuestion.id}
              custom={direction}
              variants={cardVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              <Card className="letter-card">
                <CardHeader>
                  {currentQuestion.isCustom && (
                    <Badge variant="seal" className="mb-1 w-fit">
                      {currentQuestion.createdBySlot === participantSlot
                        ? "Tu pregunta"
                        : "Pregunta de tu pareja"}
                    </Badge>
                  )}
                  <CardTitle className="font-heading text-xl leading-snug sm:text-2xl">
                    {currentQuestion.text}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={currentAnswer}
                    onChange={(e) =>
                      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: e.target.value }))
                    }
                    rows={4}
                    placeholder="Escribe tu respuesta..."
                    className="text-base"
                    autoFocus
                  />
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {!showInterstitial && (
          <>
            <div className="mt-6 flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="h-12 flex-1 text-base"
                onClick={handlePrev}
                disabled={index === 0 || isPending}
              >
                Anterior
              </Button>
              <Button
                type="button"
                size="lg"
                className="h-12 flex-1 text-base"
                onClick={handleNext}
                disabled={!currentAnswer.trim() || isPending}
              >
                {isPending ? "Guardando..." : isLast ? "Continuar" : "Siguiente"}
              </Button>
            </div>

            <div className="mt-4 flex justify-center">
              <AddQuestionDialog code={code} onCreated={handleQuestionCreated} />
            </div>
          </>
        )}
      </div>
    </main>
  );
}
