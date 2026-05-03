import type { ReactNode } from "react";

interface Props {
  items: ReactNode[];
  /** Seconds per full loop. Lower = faster. */
  speed?: number;
  /** Direction of travel. */
  direction?: "left" | "right";
}

export default function Marquee({ items, speed = 28, direction = "left" }: Props) {
  // Triple the items so even a short list feels like a continuous belt.
  // The track translates by -33.3333% (one third) so the seam lands
  // perfectly between the second and third copy and the loop is invisible.
  const tripled = [...items, ...items, ...items];
  return (
    <div className="marquee-wrap" aria-hidden="true">
      <div
        className="marquee-track"
        style={{
          animationDuration: `${speed}s`,
          animationDirection: direction === "right" ? "reverse" : "normal",
        }}
      >
        {tripled.map((it, i) => (
          <span className="marquee-item" key={i}>
            {it}
          </span>
        ))}
      </div>
    </div>
  );
}
