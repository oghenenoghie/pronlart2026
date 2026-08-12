export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="h-10 w-48 animate-pulse bg-line" />
      <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-[4/5] animate-pulse bg-line" />
        ))}
      </div>
    </div>
  );
}
