"use client";

import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function RoundInterstitial({ onContinue }: { onContinue: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
          <div className="seal inline-flex size-14 items-center justify-center rounded-full">
            <Sparkles className="size-7" />
          </div>
          <div>
            <h2 className="font-heading text-2xl font-bold text-foreground">
              ¡Ronda 1 completada!
            </h2>
            <p className="mt-2 text-muted-foreground">
              Ahora vienen algunas preguntas un poco más profundas. Tómate tu
              tiempo para responderlas. 💕
            </p>
          </div>
          <Button size="lg" className="h-12 px-8 text-base" onClick={onContinue}>
            Continuar
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
