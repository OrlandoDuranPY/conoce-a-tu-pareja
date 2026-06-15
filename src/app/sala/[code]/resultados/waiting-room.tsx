import { HeartHandshake } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RefreshButton } from "./refresh-button";

export function WaitingRoom({ title, message }: { title: string; message: string }) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Card className="letter-card">
          <CardHeader className="items-center gap-2 text-center">
            <div className="seal inline-flex size-14 items-center justify-center rounded-full">
              <HeartHandshake className="size-7" />
            </div>
            <CardTitle className="text-xl sm:text-2xl">{title}</CardTitle>
            <CardDescription className="text-base">{message}</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <RefreshButton />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
