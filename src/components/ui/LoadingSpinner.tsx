interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "w-5 h-5 border-2",
  md: "w-8 h-8 border-[3px]",
  lg: "w-12 h-12 border-4",
};

export function LoadingSpinner({
  size = "md",
  className = "",
}: LoadingSpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Đang tải"
      className={`spinner-ring inline-block rounded-full animate-spin ${sizeClasses[size]} ${className}`}
    />
  );
}

export function PageLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[360px] gap-4">
      <LoadingSpinner size="lg" />
      <p className="text-sm text-subtle">Đang tải...</p>
    </div>
  );
}

export function InlineLoading({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center py-8 ${className}`}>
      <LoadingSpinner size="md" />
    </div>
  );
}
