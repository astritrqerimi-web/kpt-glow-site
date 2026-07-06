export function KosovoFlag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 640 480" className={className} xmlns="http://www.w3.org/2000/svg">
      <path fill="#244AA5" d="M0 0h640v480H0z" />
      {/* Golden simplified map of Kosovo */}
      <path
        fill="#D0A650"
        d="M305 205c5-2 12-3 18-1 8 2 14 8 17 15 3 8 2 17-2 24-4 7-11 12-19 13-8 1-16-2-21-8-5-6-7-14-5-21 2-7 6-14 12-22z"
      />
      {/* Six white stars in an arc */}
      <g fill="#fff">
        <circle cx="255" cy="175" r="13" />
        <circle cx="285" cy="155" r="13" />
        <circle cx="320" cy="150" r="13" />
        <circle cx="355" cy="155" r="13" />
        <circle cx="385" cy="175" r="13" />
        <circle cx="320" cy="185" r="13" />
      </g>
    </svg>
  );
}

export function UsFlag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 640 480" className={className} xmlns="http://www.w3.org/2000/svg">
      <path fill="#fff" d="M0 0h640v480H0z" />
      {/* 13 stripes */}
      <g fill="#B22234">
        <path d="M0 36.92h640v36.92H0z" />
        <path d="M0 110.77h640v36.92H0z" />
        <path d="M0 184.62h640v36.92H0z" />
        <path d="M0 258.46h640v36.92H0z" />
        <path d="M0 332.31h640v36.92H0z" />
        <path d="M0 406.15h640v36.92H0z" />
        <path d="M0 480h640v-36.92H0z" />
      </g>
      {/* Blue canton */}
      <path fill="#3C3B6E" d="M0 0h256v258.46H0z" />
      {/* 9 rows of stars (simplified grid) */}
      <g fill="#fff">
        {/* Row 1 */}
        <circle cx="16" cy="12" r="6" /><circle cx="48" cy="12" r="6" /><circle cx="80" cy="12" r="6" /><circle cx="112" cy="12" r="6" /><circle cx="144" cy="12" r="6" /><circle cx="176" cy="12" r="6" />
        {/* Row 2 */}
        <circle cx="32" cy="36" r="6" /><circle cx="64" cy="36" r="6" /><circle cx="96" cy="36" r="6" /><circle cx="128" cy="36" r="6" /><circle cx="160" cy="36" r="6" />
        {/* Row 3 */}
        <circle cx="16" cy="60" r="6" /><circle cx="48" cy="60" r="6" /><circle cx="80" cy="60" r="6" /><circle cx="112" cy="60" r="6" /><circle cx="144" cy="60" r="6" /><circle cx="176" cy="60" r="6" />
        {/* Row 4 */}
        <circle cx="32" cy="84" r="6" /><circle cx="64" cy="84" r="6" /><circle cx="96" cy="84" r="6" /><circle cx="128" cy="84" r="6" /><circle cx="160" cy="84" r="6" />
        {/* Row 5 */}
        <circle cx="16" cy="108" r="6" /><circle cx="48" cy="108" r="6" /><circle cx="80" cy="108" r="6" /><circle cx="112" cy="108" r="6" /><circle cx="144" cy="108" r="6" /><circle cx="176" cy="108" r="6" />
        {/* Row 6 */}
        <circle cx="32" cy="132" r="6" /><circle cx="64" cy="132" r="6" /><circle cx="96" cy="132" r="6" /><circle cx="128" cy="132" r="6" /><circle cx="160" cy="132" r="6" />
        {/* Row 7 */}
        <circle cx="16" cy="156" r="6" /><circle cx="48" cy="156" r="6" /><circle cx="80" cy="156" r="6" /><circle cx="112" cy="156" r="6" /><circle cx="144" cy="156" r="6" /><circle cx="176" cy="156" r="6" />
        {/* Row 8 */}
        <circle cx="32" cy="180" r="6" /><circle cx="64" cy="180" r="6" /><circle cx="96" cy="180" r="6" /><circle cx="128" cy="180" r="6" /><circle cx="160" cy="180" r="6" />
        {/* Row 9 */}
        <circle cx="16" cy="204" r="6" /><circle cx="48" cy="204" r="6" /><circle cx="80" cy="204" r="6" /><circle cx="112" cy="204" r="6" /><circle cx="144" cy="204" r="6" /><circle cx="176" cy="204" r="6" />
      </g>
    </svg>
  );
}
