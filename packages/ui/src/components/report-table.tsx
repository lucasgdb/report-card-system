import { PinIcon, PinOffIcon } from 'lucide-react';

import { Button } from '@usefaz/ui/components/ui/button';
import { cn } from '@usefaz/ui/lib/utils';

type ReportTableProps = {
  /** Describes the table to screen readers (visually hidden). */
  caption: string;
  /** Label of the scrollable region, which is focusable so keyboard users can scroll it. */
  label: string;
  /**
   * Whether the first column stays put while the table scrolls sideways. Only phones can turn it off
   * (with `ReportTablePinButton`): there the column takes a good share of the screen.
   */
  firstColumnPinned?: boolean;
  children: React.ReactNode;
  className?: string;
};

// Unpinning only applies to phones, so a preference saved there never unpins the column on desktop.
const unpinnable = 'max-[599px]:group-data-[pinned=false]/report-table:static';

/**
 * Report-card table: bordered card with horizontal scrolling and a sticky first column.
 * `table-fixed`: columns given a `width` keep it; the others share the remaining space equally.
 */
export function ReportTable({ caption, label, firstColumnPinned = true, children, className }: ReportTableProps) {
  return (
    <section
      data-slot="report-table"
      data-pinned={firstColumnPinned}
      aria-label={label}
      // biome-ignore lint/a11y/noNoninteractiveTabindex: scrollable regions must be reachable by keyboard
      tabIndex={0}
      className={cn(
        'group/report-table relative overflow-x-auto rounded-2xl border border-(--surface-border) bg-(--surface) outline-none',
        'focus-visible:ring-3 focus-visible:ring-primary/35',
        className
      )}
    >
      <table className="w-full min-w-[1040px] table-fixed border-separate border-spacing-0 text-sm text-(--text-main)">
        <caption className="sr-only">{caption}</caption>
        {children}
      </table>
    </section>
  );
}

export function ReportTableHead({ children }: { children: React.ReactNode }) {
  return (
    <thead data-slot="report-table-head" className="bg-(--surface-muted)">
      {children}
    </thead>
  );
}

export function ReportTableBody({ children }: { children: React.ReactNode }) {
  return (
    <tbody data-slot="report-table-body" className="[&>tr:last-child>*]:border-b-0">
      {children}
    </tbody>
  );
}

export function ReportTableRow({ children }: { children: React.ReactNode }) {
  return (
    <tr data-slot="report-table-row" className="group/row">
      {children}
    </tr>
  );
}

type Align = 'left' | 'center';

type ReportTableHeaderCellProps = React.ComponentProps<'th'> & {
  align?: Align;
  /** Groups the columns below it (e.g. a bimester): emphasized label. Combine with `divider` for a border. */
  group?: boolean;
  /** Divider on the left, starting a new column group. */
  divider?: boolean;
  /** Sticks to the left edge while the table scrolls horizontally. */
  sticky?: boolean;
  /** Fixed column width in pixels; columns without one share the remaining space. */
  width?: number;
};

export function ReportTableHeaderCell({
  align = 'center',
  group = false,
  divider = false,
  sticky = false,
  width,
  className,
  style,
  ...props
}: ReportTableHeaderCellProps) {
  return (
    <th
      data-slot="report-table-header-cell"
      scope={props.colSpan && props.colSpan > 1 ? 'colgroup' : 'col'}
      className={cn(
        'border-b border-(--surface-border) px-2 py-3 text-xs font-semibold tracking-[0.06em] text-balance text-(--text-muted) uppercase',
        align === 'center' ? 'text-center' : 'text-left',
        divider && 'border-l',
        group && 'text-(--text-main)',
        // On phones the sticky column narrows (beating the inline `width`), leaving room for the grades.
        sticky && ['sticky left-0 z-[2] border-r bg-(--surface-muted) max-[599px]:w-32!', unpinnable],
        className
      )}
      style={width ? { width, ...style } : style}
      {...props}
    />
  );
}

/** First cell of a body row: names the row for screen readers and stays visible while scrolling. */
export function ReportTableRowHeader({ className, ...props }: React.ComponentProps<'th'>) {
  return (
    <th
      data-slot="report-table-row-header"
      scope="row"
      className={cn(
        'sticky left-0 z-[1] border-r border-b border-(--surface-border) bg-(--surface) px-3 py-3 text-left font-normal min-[600px]:px-4',
        unpinnable,
        'transition-colors group-hover/row:bg-(--surface-hover)',
        className
      )}
      {...props}
    />
  );
}

type ReportTableCellProps = React.ComponentProps<'td'> & {
  align?: Align;
  /** Divider on the left, starting a new column group. */
  divider?: boolean;
};

export function ReportTableCell({ align = 'center', divider = false, className, ...props }: ReportTableCellProps) {
  return (
    <td
      data-slot="report-table-cell"
      className={cn(
        'border-b border-(--surface-border) px-2 py-3 tabular-nums transition-colors group-hover/row:bg-(--surface-hover)',
        align === 'center' ? 'text-center' : 'text-left',
        divider && 'border-l',
        className
      )}
      {...props}
    />
  );
}

type ReportTablePinButtonProps = {
  pinned: boolean;
  onPinnedChange(pinned: boolean): void;
  className?: string;
};

/** Pins or unpins the first column; shown on phones only, where unpinning makes a difference. */
export function ReportTablePinButton({ pinned, onPinnedChange, className }: ReportTablePinButtonProps) {
  return (
    <Button
      data-slot="report-table-pin-button"
      variant="ghost"
      size="icon-xs"
      aria-pressed={pinned}
      aria-label="Fixar coluna de disciplinas"
      onClick={() => onPinnedChange(!pinned)}
      className={cn('-my-1 shrink-0 text-(--text-muted) aria-pressed:text-primary min-[600px]:hidden', className)}
    >
      {pinned ? <PinIcon /> : <PinOffIcon />}
    </Button>
  );
}
