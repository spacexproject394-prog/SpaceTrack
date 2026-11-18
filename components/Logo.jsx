// SpaceTrack logo — original artwork drawn for this project.
// Shield (protection) + cat (the animals) + gold signal arcs (the implant).
export default function Logo({ size = 40, showWordmark = true, tagline = false, founder = false, className = "" }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="SpaceTrack logo"
        className="shrink-0"
      >
        <path
          d="M32 2.5 L55.5 10.8 V32.6 C55.5 47 45.2 57.2 32 61.5 C18.8 57.2 8.5 47 8.5 32.6 V10.8 Z"
          fill="#5E2A52"
          stroke="#D4A017"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <g stroke="#D4A017" strokeWidth="2.6" strokeLinecap="round" fill="none">
          <path d="M20 18 A12 12 0 0 1 44 18" />
          <path d="M24.5 18 A7.5 7.5 0 0 1 39.5 18" />
        </g>
        <circle cx="32" cy="18" r="2.4" fill="#D4A017" />
        <g fill="#FDF6EC">
          <circle cx="32" cy="34" r="7.5" />
          <path d="M26.3 29.5 L24.6 21.8 L31.2 25.9 Z" />
          <path d="M37.7 29.5 L39.4 21.8 L32.8 25.9 Z" />
          <ellipse cx="32" cy="47" rx="8.6" ry="7.8" />
        </g>
        <path
          d="M39.5 51.5 C46.5 53.5 49 46.5 45.5 43"
          stroke="#FDF6EC"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="32" cy="41.5" r="1.8" fill="#D4A017" />
      </svg>
      {showWordmark && (
        <span className="leading-tight">
          <span className="block text-lg font-bold tracking-tight text-foreground">
            Space<span className="text-primary">Track</span>
          </span>
          {tagline && (
            <span className="block text-[10px] font-medium uppercase tracking-[0.18em] text-muted">
              Keeping every pet safe
            </span>
          )}
          {founder && (
            <span className="block text-[9px] font-semibold uppercase tracking-[0.28em] text-primary">
              Vanessa Zamzow
            </span>
          )}
        </span>
      )}
    </span>
  );
}
