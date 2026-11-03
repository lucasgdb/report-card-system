import { cn } from '@usefaz/ui/lib/utils';

type SpreadsheetPreviewProps = {
  columns: readonly string[];
  rows: readonly (readonly string[])[];
  className?: string;
  'aria-label'?: string;
};

/** A few lines of a spreadsheet, as they should be in the file (scrolls sideways when wide). */
export function SpreadsheetPreview({ columns, rows, className, ...props }: SpreadsheetPreviewProps) {
  return (
    <div
      data-slot="spreadsheet-preview"
      className={cn('overflow-x-auto overscroll-x-contain rounded-lg border bg-card', className)}
    >
      <table className="w-max border-collapse font-mono text-xs" aria-label={props['aria-label']}>
        <thead>
          <tr className="bg-muted">
            {columns.map((column) => (
              <th
                key={column}
                scope="col"
                className="border-r px-2.5 py-1.5 text-left font-medium whitespace-nowrap text-foreground last:border-r-0"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-t">
              {row.map((value, column) => (
                <td
                  key={column}
                  className="border-r px-2.5 py-1.5 whitespace-nowrap text-muted-foreground tabular-nums last:border-r-0"
                >
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
