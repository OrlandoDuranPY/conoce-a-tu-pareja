import Link from "next/link";
import { ArrowLeft, Heart } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CrearSalaForm } from "./crear-sala-form";

export default function CrearSalaPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Volver al inicio
      </Link>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 inline-flex size-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
            <Heart className="size-6 fill-current" />
          </div>
          <CardTitle className="font-heading text-2xl">Crea su sala</CardTitle>
          <CardDescription>
            Vamos a preparar un espacio privado solo para ustedes dos. Al
            final te daremos un código para compartir con tu pareja.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CrearSalaForm />
        </CardContent>
      </Card>
    </main>
  );
}
