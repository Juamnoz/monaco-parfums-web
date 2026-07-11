// GitHub Pages sirve este sitio bajo /monaco-parfums-web/, así que cualquier
// referencia a un archivo de public/ (imágenes, video) necesita ese prefijo
// en producción. En local dev queda vacío. Se inyecta en CI vía NEXT_PUBLIC_BASE_PATH.
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function assetPath(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${BASE_PATH}${path}`;
}
