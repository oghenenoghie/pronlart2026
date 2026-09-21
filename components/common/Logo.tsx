export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      role="img"
      aria-label="B-Edge Artworks"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="20" cy="20" r="18.5" fill="none" stroke="#B08D57" strokeWidth="1" />
      <circle cx="20" cy="20" r="15.5" fill="none" stroke="#B08D57" strokeWidth="0.5" opacity="0.5" />
      <text
        x="20"
        y="27"
        textAnchor="middle"
        fontFamily="'Playfair Display', Georgia, 'Times New Roman', serif"
        fontStyle="italic"
        fontWeight="700"
        fontSize="16"
        letterSpacing="0.5"
        fill="#B08D57"
      >
        BE
      </text>
    </svg>
  );
}
