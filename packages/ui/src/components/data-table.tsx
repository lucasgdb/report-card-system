import {
  createPaginatedRowModel,
  createSortedRowModel,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  tableFeatures,
  useTable,
} from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { useId, useMemo } from 'react';

import { Button } from '@usefaz/ui/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@usefaz/ui/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@usefaz/ui/components/ui/table';
import { cn } from '@usefaz/ui/lib/utils';

export type GridValidRowModel = { id: string | number; [key: string]: any };

export type GridRowsProp<Row extends GridValidRowModel = GridValidRowModel> = readonly Row[];

export type GridRenderCellParams<Row extends GridValidRowModel = any, Value = any> = {
  id: Row['id'];
  field: string;
  row: Row;
  value: Value;
};

/** Subset of MUI's `GridColDef` that the apps use. */
export type GridColDef<Row extends GridValidRowModel = any> = {
  field: string;
  headerName?: string;
  width?: number;
  flex?: number;
  headerAlign?: 'left' | 'center' | 'right';
  align?: 'left' | 'center' | 'right';
  /** Extra classes for this column's body cells (e.g. `tabular-nums`). */
  cellClassName?: string;
  sortable?: boolean;
  renderCell?: (params: GridRenderCellParams<Row>) => React.ReactNode;
  // Accepted for compatibility; there is no column menu, filtering or editing.
  disableColumnMenu?: boolean;
  filterable?: boolean;
  editable?: boolean;
  hideable?: boolean;
};

export type DataTableProps<Row extends GridValidRowModel> = {
  rows: GridRowsProp<Row>;
  columns: GridColDef<Row>[];
  columnVisibilityModel?: Record<string, boolean>;
  /** `false` makes the table fill its container (empty space goes above the footer). */
  autoHeight?: boolean;
  className?: string;
};

const features = tableFeatures({
  rowSortingFeature,
  rowPaginationFeature,
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric },
});

const PAGE_SIZE_OPTIONS = [25, 50, 100];

const alignClasses = {
  left: 'justify-start text-left',
  center: 'justify-center text-center',
  right: 'justify-end text-right',
};

/** Sortable, paginated table (pt-BR), configured with MUI DataGrid-like columns. */
export function DataTable<Row extends GridValidRowModel>({
  rows,
  columns,
  columnVisibilityModel,
  autoHeight = true,
  className,
}: DataTableProps<Row>) {
  const visibleColumns = useMemo(
    () => columns.filter((column) => columnVisibilityModel?.[column.field] !== false),
    [columns, columnVisibilityModel]
  );

  const tableColumns = useMemo(
    () =>
      visibleColumns.map((column) => ({
        id: column.field,
        accessorFn: (row: Row) => row[column.field],
        header: column.headerName ?? '',
        enableSorting: column.sortable !== false && !column.renderCell,
        sortFn: 'alphanumeric' as const,
      })),
    [visibleColumns]
  );

  const data = useMemo(() => [...rows], [rows]);

  const table = useTable({
    features,
    columns: tableColumns,
    data,
    getRowId: (row: Row) => String(row.id),
    initialState: { pagination: { pageIndex: 0, pageSize: 100 } },
  });

  const pageSizeLabelId = useId();
  const { pageIndex, pageSize } = table.state.pagination;
  const numberFormat = new Intl.NumberFormat('pt-BR');
  const total = rows.length;
  const from = total === 0 ? 0 : pageIndex * pageSize + 1;
  const to = Math.min(total, (pageIndex + 1) * pageSize);

  // Sorted columns announce their direction; sortable but unsorted ones say they can be sorted.
  const ariaSort = (sorted: false | 'asc' | 'desc', canSort: boolean) => {
    if (sorted) {
      return sorted === 'asc' ? 'ascending' : 'descending';
    }
    return canSort ? 'none' : undefined;
  };

  const columnStyle = (column: GridColDef<Row>): React.CSSProperties =>
    column.flex ? { minWidth: column.width ?? 50 } : { width: column.width ?? 100 };

  return (
    <div
      data-slot="data-table"
      className={cn(
        'flex flex-col overflow-hidden rounded-xl border border-border bg-card text-sm text-card-foreground',
        !autoHeight && 'flex-1',
        className
      )}
    >
      <Table className="table-fixed text-sm">
        <colgroup>
          {visibleColumns.map((column) => (
            <col key={column.field} style={column.flex ? undefined : { width: column.width ?? 100 }} />
          ))}
        </colgroup>
        <TableHeader>
          <TableRow className="h-12 bg-muted/50 hover:bg-muted/50">
            {table.getHeaderGroups()[0]?.headers.map((header, index) => {
              const column = visibleColumns[index];
              const sorted = header.column.getIsSorted();
              const canSort = header.column.getCanSort();
              const title = <span className="truncate">{column.headerName}</span>;
              return (
                <TableHead
                  key={header.id}
                  style={columnStyle(column)}
                  aria-sort={ariaSort(sorted, canSort)}
                  className={cn(
                    'group/header relative h-12 px-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase',
                    alignClasses[column.headerAlign ?? 'left']
                  )}
                >
                  {canSort ? (
                    <button
                      type="button"
                      onClick={header.column.getToggleSortingHandler()}
                      className={cn(
                        'flex w-full cursor-pointer items-center gap-1 rounded-sm text-inherit uppercase outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/35',
                        alignClasses[column.headerAlign ?? 'left']
                      )}
                    >
                      {title}
                      <span
                        className={cn(
                          'inline-flex text-foreground',
                          !sorted && 'opacity-0 group-hover/header:opacity-50'
                        )}
                      >
                        {sorted === 'desc' ? <ArrowDown className="size-4" /> : <ArrowUp className="size-4" />}
                      </span>
                    </button>
                  ) : (
                    title
                  )}
                  {index < visibleColumns.length - 1 && (
                    <span aria-hidden className="absolute top-1/2 right-0 h-5 w-px -translate-y-1/2 bg-border" />
                  )}
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} className="h-[52px]">
              {visibleColumns.map((column) => {
                const value = row.original[column.field];
                return (
                  <TableCell
                    key={column.field}
                    className={cn(
                      'overflow-hidden px-3 text-ellipsis',
                      alignClasses[column.align ?? 'left'],
                      column.cellClassName
                    )}
                  >
                    {column.renderCell
                      ? column.renderCell({ id: row.original.id, field: column.field, row: row.original, value })
                      : (value as React.ReactNode)}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex-1" />

      <div className="flex min-h-[52px] items-center justify-end gap-2 border-t border-border px-3 text-muted-foreground">
        <span id={pageSizeLabelId} className="hidden min-[600px]:inline">
          Linhas por página
        </span>
        <Select
          value={pageSize}
          onValueChange={(value) => table.setPageSize(Number(value))}
          items={PAGE_SIZE_OPTIONS.map((option) => ({ value: option, label: String(option) }))}
        >
          <SelectTrigger size="sm" aria-labelledby={pageSizeLabelId} className="mr-4">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PAGE_SIZE_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="mr-2 tabular-nums" aria-live="polite">
          {numberFormat.format(from)}–{numberFormat.format(to)} de {numberFormat.format(total)}
        </span>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          aria-label="Página anterior"
        >
          <ChevronLeft />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          aria-label="Próxima página"
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
