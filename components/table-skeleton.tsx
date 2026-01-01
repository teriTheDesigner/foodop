interface TableSkeletonProps {
  team?: boolean;
}
export default function TableSkeleton({ team }: TableSkeletonProps) {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i} className="border-b">
          <td className="py-4 px-4">
            {team ? (
              <div className="flex items-center gap-3">
                <div className="h-16 w-16 rounded-full bg-muted animate-pulse" />
                <div className="h-4 w-32 bg-muted animate-pulse rounded" />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="h-4 w-40 bg-muted animate-pulse rounded" />
              </div>
            )}
          </td>
          <td className="py-4 px-4">
            <div className="h-4 w-40 bg-muted animate-pulse rounded" />
          </td>
          <td className="py-4 px-4">
            <div className="h-4 w-40 bg-muted animate-pulse rounded" />
          </td>
          <td className="py-4 px-4">
            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
          </td>
          {!team && (
            <td className="py-4 px-4">
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
            </td>
          )}
          <td className="py-4 px-4 text-right">
            <div className="h-8 w-8 bg-muted animate-pulse rounded-md ml-auto" />
          </td>
        </tr>
      ))}
    </>
  );
}
