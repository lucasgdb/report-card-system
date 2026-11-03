import { FileSpreadsheetIcon, UploadCloudIcon, XIcon } from 'lucide-react';
import { useId, useRef, useState } from 'react';

import { Button } from '@usefaz/ui/components/ui/button';
import { cn } from '@usefaz/ui/lib/utils';

type FileDropzoneProps = {
  file: File | null;
  onFileChange(file: File | null): void;
  /** Same as the input's `accept` (e.g. `.csv`); dropped files of other types are ignored. */
  accept?: string;
  /** The line under the call to action (types and size limit). */
  hint?: React.ReactNode;
  /** Shown under the file name once a file is chosen (e.g. what was read from it). */
  details?: React.ReactNode;
  invalid?: boolean;
  'aria-describedby'?: string;
  className?: string;
  ref?: React.Ref<HTMLButtonElement>;
};

const formatSize = (bytes: number) =>
  bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

function matchesAccept(file: File, accept?: string) {
  if (!accept) {
    return true;
  }
  const name = file.name.toLowerCase();
  return accept.split(',').some((type) => {
    const value = type.trim().toLowerCase();
    return value.startsWith('.') ? name.endsWith(value) : file.type === value;
  });
}

/** Picks one file by click or drag and drop; once chosen, shows it with a button to remove it. */
export function FileDropzone({
  file,
  onFileChange,
  accept,
  hint,
  details,
  invalid,
  className,
  ref,
  ...props
}: FileDropzoneProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const pick = (picked: File | null | undefined) => {
    if (picked && matchesAccept(picked, accept)) {
      onFileChange(picked);
    }
  };

  const input = (
    <input
      ref={inputRef}
      id={inputId}
      type="file"
      accept={accept}
      hidden
      onChange={(event) => {
        pick(event.target.files?.item(0));
        // Lets the same file be chosen again after removing it.
        event.target.value = '';
      }}
    />
  );

  if (file) {
    return (
      <div
        data-slot="file-dropzone"
        data-invalid={invalid || undefined}
        className={cn(
          'flex items-center gap-3 rounded-xl border bg-card p-3 data-invalid:border-destructive',
          className
        )}
      >
        {input}
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <FileSpreadsheetIcon className="size-5" />
        </span>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm font-medium text-foreground">{file.name}</span>
          <span className="text-xs text-muted-foreground">
            {formatSize(file.size)}
            {details && <> · {details}</>}
          </span>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground"
          aria-label={`Remover ${file.name}`}
          onClick={() => onFileChange(null)}
        >
          <XIcon />
        </Button>
      </div>
    );
  }

  return (
    <>
      {input}
      <button
        ref={ref}
        type="button"
        data-slot="file-dropzone"
        data-dragging={dragging || undefined}
        aria-invalid={invalid || undefined}
        aria-describedby={props['aria-describedby']}
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          pick(event.dataTransfer.files.item(0));
        }}
        className={cn(
          'flex w-full cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-input bg-muted/40 px-4 py-7 text-center transition-colors outline-none',
          'hover:border-primary/60 hover:bg-primary/5 focus-visible:ring-3 focus-visible:ring-ring/50',
          'data-dragging:border-primary data-dragging:bg-primary/5 aria-invalid:border-destructive',
          className
        )}
      >
        <span className="flex size-10 items-center justify-center rounded-full bg-background text-primary ring-1 ring-border">
          <UploadCloudIcon className="size-5" />
        </span>
        <span className="text-sm text-foreground">
          <span className="font-semibold text-primary">Clique para selecionar</span> ou arraste o arquivo aqui
        </span>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </button>
    </>
  );
}
