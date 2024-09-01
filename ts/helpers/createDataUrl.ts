export function createDataUrl(mimeType: string, b64: string) {
  return `data:${mimeType};base64,${b64}`;
}
