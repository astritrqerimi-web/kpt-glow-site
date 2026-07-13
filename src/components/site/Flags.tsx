import kosovoFlag from "@/assets/kosovo-flag.png.asset.json";

export function KosovoFlag({ className }: { className?: string }) {
  return (
    <img
      src={kosovoFlag.url}
      alt="Flamuri i Kosovës"
      className={className}
      style={{ objectFit: "cover" }}
    />
  );
}

// Build a 5-pointed star path centered at (cx, cy) with outer radius r
function starPath(cx: number, cy: number, r: number): string {
  const inner = r * 0.38197;
  let d = "";
  for (let i = 0; i < 10; i++) {
    const angle = -Math.PI / 2 + (i * Math.PI) / 5;
    const rad = i % 2 === 0 ? r : inner;
    const x = cx + Math.cos(angle) * rad;
    const y = cy + Math.sin(angle) * rad;
    d += (i === 0 ? "M" : "L") + x.toFixed(2) + "," + y.toFixed(2) + " ";
  }
  return d + "Z";
}

// Official US flag proportions: 1:1.9, 13 stripes, 50 stars (9 rows: 6-5-6-5-6-5-6-5-6)
const FLAG_W = 1900;
const FLAG_H = 1000;
const STRIPE_H = FLAG_H / 13;
const UNION_W = FLAG_W * 0.4;
const UNION_H = STRIPE_H * 7;

const stars: string[] = [];
{
  const rows = 9;
  const rowGap = UNION_H / (rows + 1);
  const starR = rowGap * 0.32;
  for (let row = 0; row < rows; row++) {
    const cols = row % 2 === 0 ? 6 : 5;
    const colGap = UNION_W / (cols + 1);
    const offset = row % 2 === 0 ? 0 : colGap / 2;
    for (let col = 0; col < cols; col++) {
      const cx = colGap * (col + 1) + (row % 2 === 0 ? 0 : offset);
      const cy = rowGap * (row + 1);
      stars.push(starPath(cx, cy, starR));
    }
  }
}

export function UsFlag({ className }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${FLAG_W} ${FLAG_H}`}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Red background = top stripe is red */}
      <rect width={FLAG_W} height={FLAG_H} fill="#B22234" />
      {/* 6 white stripes at odd indices (1,3,5,7,9,11) */}
      {[1, 3, 5, 7, 9, 11].map((i) => (
        <rect key={i} y={i * STRIPE_H} width={FLAG_W} height={STRIPE_H} fill="#fff" />
      ))}
      {/* Union */}
      <rect width={UNION_W} height={UNION_H} fill="#3C3B6E" />
      {/* Stars */}
      <g fill="#fff">
        {stars.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
    </svg>
  );
}
