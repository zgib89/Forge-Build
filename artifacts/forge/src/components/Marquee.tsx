import type { ReactNode } from "react";

interface Props {
  items: ReactNode[];
  speed?: number;
}

export default function Marquee({ items, speed = 50 }: Props) {
  const doubled = [...items, ...items];
  return (
    <div className="marquee-wrap" aria-hidden="true">
      <div
        className="marquee-track"
        style={{ animationDuration: `${speed}s` }}
      >
        {doubled.map((it, i) => (
          <span className="marquee-item" key={i}>
            {it}
          </span>
        ))}
      </div>
    </div>
  );
}
