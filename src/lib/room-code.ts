import { customAlphabet } from "nanoid";

// Sin 0/O/1/I/L para evitar ambigüedad al transcribir el código a mano.
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

export const ROOM_CODE_LENGTH = 6;

const nanoid = customAlphabet(ALPHABET, ROOM_CODE_LENGTH);

export function generateRoomCode(): string {
  return nanoid();
}

export function normalizeRoomCode(code: string): string {
  return code.trim().toUpperCase();
}
