import { ZoomInIcon, ZoomOutIcon } from 'lucide-react';
import { useId, useState } from 'react';
import Cropper, { type Area } from 'react-easy-crop';

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;

type AvatarCropperProps = {
  src: string;
  onCropComplete(area: Area): void;
};

/** Round, square crop of the chosen photo: drag to position, zoom with the slider, wheel or pinch. */
export default function AvatarCropper({ src, onCropComplete }: AvatarCropperProps) {
  const zoomId = useId();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(MIN_ZOOM);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative h-72 overflow-hidden rounded-xl bg-muted sm:h-80">
        <Cropper
          image={src}
          crop={crop}
          zoom={zoom}
          minZoom={MIN_ZOOM}
          maxZoom={MAX_ZOOM}
          aspect={1}
          cropShape="round"
          showGrid={false}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={(_area, areaPixels) => onCropComplete(areaPixels)}
        />
      </div>

      <div className="flex items-center gap-3">
        <label htmlFor={zoomId} className="sr-only">
          Zoom
        </label>
        <ZoomOutIcon aria-hidden className="size-4 shrink-0 text-muted-foreground" />
        <input
          id={zoomId}
          type="range"
          min={MIN_ZOOM}
          max={MAX_ZOOM}
          step={0.01}
          value={zoom}
          onChange={(event) => setZoom(Number(event.target.value))}
          aria-valuetext={`${Math.round(zoom * 100)}%`}
          className="h-2 w-full cursor-pointer accent-primary"
        />
        <ZoomInIcon aria-hidden className="size-4 shrink-0 text-muted-foreground" />
      </div>
    </div>
  );
}
