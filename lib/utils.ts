import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Utility function to merge class names */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Deep copy an object using JSON */
export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));

/** Convert a file to an Object URL for preview */
export const convertFileToUrl = (file: File) =>
  typeof window !== "undefined" ? URL.createObjectURL(file) : "";

/** Format date and time with various presets */
export const formatDateTime = (
  dateInput: Date | string,
  timeZone: string = Intl.DateTimeFormat().resolvedOptions().timeZone
) => {
  const date = new Date(dateInput);

  const options: Record<string, Intl.DateTimeFormatOptions> = {
    dateTime: {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      timeZone,
    },
    dateDay: {
      weekday: "short",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone,
    },
    dateOnly: {
      month: "short",
      year: "numeric",
      day: "numeric",
      timeZone,
    },
    timeOnly: {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      timeZone,
    },
  };

  return {
    dateTime: date.toLocaleString("en-US", options.dateTime),
    dateDay: date.toLocaleString("en-US", options.dateDay),
    dateOnly: date.toLocaleString("en-US", options.dateOnly),
    timeOnly: date.toLocaleString("en-US", options.timeOnly),
  };
};

/** Encrypt passkey using Base64 encoding */
export function encryptKey(passkey: string) {
  try {
    if (typeof window !== "undefined") {
      return btoa(passkey);
    } else {
      return Buffer.from(passkey).toString("base64");
    }
  } catch (error) {
    console.error("Error encrypting key:", error);
    return "";
  }
}

/** Decrypt passkey using Base64 decoding */
export function decryptKey(passkey: string) {
  try {
    if (typeof window !== "undefined") {
      return atob(passkey);
    } else {
      return Buffer.from(passkey, "base64").toString("utf-8");
    }
  } catch (error) {
    console.error("Error decrypting key:", error);
    return "";
  }
}
