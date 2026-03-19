import pako from "pako";

export function encodeBase64(text: string): string {
  try {
    const bytes = new TextEncoder().encode(text);
    const compressed = pako.deflate(bytes);

    const binString = Array.from(compressed, (byte) =>
      String.fromCodePoint(byte),
    ).join("");

    return btoa(binString)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  } catch (e) {
    console.error("Failed to encode and compress data", e);
    return "";
  }
}

export function decodeBase64(data: string): string {
  if (!data) return "";

  try {
    let b64 = data.replace(/-/g, "+").replace(/_/g, "/");
    while (b64.length % 4) {
      b64 += "=";
    }

    const binString = atob(b64);
    const bytes = Uint8Array.from(binString, (m) => m.codePointAt(0)!);

    const decompressed = pako.inflate(bytes);
    return new TextDecoder().decode(decompressed);
  } catch (e) {
    console.error("Failed to decode compressed data", e);
    return "Error: Could not decode data. It may be malformed.";
  }
}
