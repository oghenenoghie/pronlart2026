export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="h-10 w-64 animate-pulse bg-line" />
      <div className="mt-4 h-16 max-w-2xl animate-pulse bg-line" />
      <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-12 border-t border-line pt-12 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="aspect-[4/5] animate-pulse bg-line" />
        ))}
      </div>
    </div>
  );
}
