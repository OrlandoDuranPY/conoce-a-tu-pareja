"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function RoomCodeBadge({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success("Código copiado. ¡Compártelo con tu pareja!");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("No se pudo copiar el código.");
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleCopy}
      className="gap-1.5 font-mono text-sm tracking-[0.2em]"
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      {code}
    </Button>
  );
}
