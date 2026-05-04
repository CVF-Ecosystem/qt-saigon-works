export function ResponsiveTable({
  ariaLabel,
  minWidth = 760,
  children,
}: {
  ariaLabel: string;
  minWidth?: number;
  children: React.ReactNode;
}) {
  return (
    <div className="responsive-table" aria-label={ariaLabel}>
      <table style={{ minWidth }}>
        {children}
      </table>
    </div>
  );
}
