"use client";

import { useRef, useState } from "react";
import { PenLine, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const MAX_WIDTH = 480;
const JPEG_QUALITY = 0.7;
const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB antes de comprimir

function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const scale = Math.min(1, MAX_WIDTH / img.width);
        const width = Math.round(img.width * scale);
        const height = Math.round(img.height * scale);

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("No se pudo procesar la imagen."));
          return;
        }

        // Fondo blanco: las firmas con transparencia no deben verse negras en JPEG.
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        resolve(canvas.toDataURL("image/jpeg", JPEG_QUALITY));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function SignatureUpload({
  value,
  onChange,
}: {
  value: string;
  onChange: (dataUrl: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Selecciona un archivo de imagen.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error("La imagen es demasiado grande. Elige una más liviana.");
      return;
    }
    setIsProcessing(true);
    try {
      const dataUrl = await compressImage(file);
      onChange(dataUrl);
    } catch {
      toast.error("No pudimos procesar la imagen. Intenta con otra.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
          e.target.value = "";
        }}
      />
      {value ? (
        <div className="relative inline-flex rounded-lg border border-input bg-white p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Tu firma" className="h-24 max-w-full object-contain" />
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="absolute -right-2 -top-2 size-7 rounded-full bg-background"
            onClick={() => onChange("")}
          >
            <X className="size-3.5" />
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="h-24 w-full flex-col gap-1.5 border-dashed text-muted-foreground"
          onClick={() => inputRef.current?.click()}
          disabled={isProcessing}
        >
          <PenLine className="size-5" />
          {isProcessing ? "Procesando..." : "Sube una imagen de tu firma"}
        </Button>
      )}
    </div>
  );
}
