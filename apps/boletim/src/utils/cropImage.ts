export type CropArea = { x: number; y: number; width: number; height: number };

const OUTPUT_SIZE = 512;

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', reject);
    image.src = src;
  });

/** Draws the cropped area of an image on a square canvas and returns it as a WebP (or PNG) blob. */
export async function cropImage(src: string, area: CropArea): Promise<Blob> {
  const image = await loadImage(src);

  const canvas = document.createElement('canvas');
  canvas.width = OUTPUT_SIZE;
  canvas.height = OUTPUT_SIZE;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Canvas 2D is not available');
  }

  context.imageSmoothingQuality = 'high';
  context.drawImage(image, area.x, area.y, area.width, area.height, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Could not export the image'))),
      'image/webp',
      0.9
    );
  });
}
