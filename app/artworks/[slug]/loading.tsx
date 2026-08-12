export default function Loading() {
  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 py-16 md:grid-cols-2">
      <div className="aspect-[4/5] animate-pulse bg-line" />
      <div className="space-y-4">
        <div className="h-4 w-24 animate-pulse bg-line" />
        <div className="h-10 w-2/3 animate-pulse bg-line" />
        <div className="h-4 w-40 animate-pulse bg-line" />
      </div>
    </div>
  );
}
