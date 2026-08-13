export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="h-10 w-40 animate-pulse bg-line" />
      <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-10 border-t border-line pt-12 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse bg-line" />
        ))}
      </div>
    </div>
  );
}
