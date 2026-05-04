export function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <div className="max-w-md">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
          Coming soon
        </p>
        <h1 className="text-3xl font-bold text-slate-900 mb-4">{title}</h1>
        <p className="text-slate-500 leading-relaxed">
          Module nay se duoc xay dung sau khi hoan thanh Phase 0 shell va ket
          noi Supabase.
        </p>
      </div>
    </div>
  );
}
