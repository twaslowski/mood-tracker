import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function instanceUrl() {
  return "https://moody.twaslowski.com";
}

export const range = (start: number, stop: number): Array<number> =>
  Array.from({ length: stop - start + 1 }, (_, index) => start + index);
