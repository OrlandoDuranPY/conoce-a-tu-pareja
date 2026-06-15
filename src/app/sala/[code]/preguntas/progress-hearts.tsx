import { Heart } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function ProgressHearts({ current, total }: { current: number; total: number }) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="w-full">
      <div className="mb-1.5 flex items-center justify-between text-sm font-medium text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Heart className="size-4 fill-primary text-primary" />
          Pregunta {current} de {total}
        </span>
        <span>{pct}%</span>
      </div>
      <div className="relative py-1.5">
        <Progress
          value={pct}
          className="**:data-[slot=progress-track]:h-2.5 **:data-[slot=progress-indicator]:bg-gradient-to-r **:data-[slot=progress-indicator]:from-rose-400 **:data-[slot=progress-indicator]:to-primary"
        />
        <Heart
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 fill-seal text-seal drop-shadow-sm transition-[left] duration-300"
          style={{ left: `${pct}%` }}
        />
      </div>
    </div>
  );
}
