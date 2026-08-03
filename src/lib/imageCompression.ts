// Compression côté client avant envoi : redimensionne à 1280px max,
// JPEG qualité 0.8 via canvas. Le passage par canvas supprime d'office
// les métadonnées EXIF (dont la géolocalisation).

const MAX_DIMENSION = 1280;
const JPEG_QUALITY = 0.8;
export const MAX_FILE_BYTES = 15 * 1024 * 1024; // rejet avant compression

export async function compressImage(file: File): Promise<string> {
  if (file.size > MAX_FILE_BYTES) {
    throw new Error('FILE_TOO_LARGE');
  }
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('READ_ERROR'));
    reader.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('DECODE_ERROR'));
    image.src = dataUrl;
  });

  const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('CANVAS_ERROR');
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', JPEG_QUALITY);
}
