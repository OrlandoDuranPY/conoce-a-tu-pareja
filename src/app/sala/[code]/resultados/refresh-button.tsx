"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function RefreshButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      className="h-11 gap-2"
      disabled={isPending}
      onClick={() => startTransition(() => router.refresh())}
    >
      <RefreshCw className={cn("size-4", isPending && "animate-spin")} />
      Actualizar
    </Button>
  );
}
