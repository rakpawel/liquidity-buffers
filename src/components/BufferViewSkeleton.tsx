import { Skeleton } from "@/components/ui/skeleton";

export const BufferViewSkeleton = () => {
  return (
    <div className="h-full flex items-center justify-center gap-2 rounded-md">
      <Skeleton className="w-full h-full" />
    </div>
  );
};
