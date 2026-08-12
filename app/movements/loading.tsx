export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="h-10 w-56 animate-pulse bg-line" />
      <div className="mt-12 space-y-6 border-t border-line pt-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 animate-pulse bg-line" />
        ))}
      </div>
    </div>
  );
}
