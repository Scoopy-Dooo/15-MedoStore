import { Skeleton } from '../ui/skeleton';
import { TableRow, TableCell } from '../ui/table';

interface TableRowSkeletonProps {
  columns: number;
}

export function TableRowSkeleton({ columns }: TableRowSkeletonProps) {
  return (
    <TableRow>
      {Array.from({ length: columns }).map((_, idx) => (
        <TableCell key={idx}>
          <Skeleton className="h-4 w-full" />
        </TableCell>
      ))}
    </TableRow>
  );
}
