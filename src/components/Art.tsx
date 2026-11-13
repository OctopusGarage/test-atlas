/** Original cartographic motifs: orbit, connection, and reflection. */
export function Compass({ variant = "green", large = false }) {
  const connection = variant === "peach";
  const reflection = variant === "lavender";
  return (
    <div className={`compass-art ${variant} ${large ? "large" : ""}`} aria-hidden="true">
      <svg viewBox="0 0 320 320" fill="none">
        <circle className="art-orbit" pathLength="1" cx="160" cy="160" r="118" stroke="currentColor" strokeWidth=".7" />
        <circle className="art-orbit" pathLength="1" cx="160" cy="160" r="87" stroke="currentColor" strokeWidth=".55" />
        <path className="art-axis" d="M160 16V304M16 160H304" stroke="currentColor" strokeWidth=".5" strokeDasharray="2 6" />
        {connection ? (
          <g stroke="currentColor" strokeWidth=".85">
            {[0, 60, 120].map((angle) => <ellipse key={angle} cx="160" cy="160" rx="104" ry="50" transform={`rotate(${angle} 160 160)`} />)}
            <circle cx="125" cy="160" r="50" /><circle cx="195" cy="160" r="50" />
          </g>
        ) : reflection ? (
          <g stroke="currentColor" strokeWidth=".8">
            {[0, 45, 90, 135].map((angle) => <rect key={angle} x="91" y="91" width="138" height="138" rx="24" transform={`rotate(${angle} 160 160)`} />)}
            <circle cx="160" cy="160" r="43" />
          </g>
        ) : (
          <g stroke="currentColor" strokeWidth=".8">
            {Array.from({ length: 8 }, (_, i) => <ellipse key={i} cx="160" cy="125" rx="32" ry="73" transform={`rotate(${i * 45} 160 160)`} />)}
          </g>
        )}
        <g stroke="currentColor" strokeWidth=".8">
          {Array.from({ length: 12 }, (_, i) => <path key={i} d="M160 36V42" transform={`rotate(${i * 30} 160 160)`} />)}
        </g>
        <circle cx="160" cy="160" r="5" fill="currentColor" />
        <circle className="art-marker" cx="160" cy="42" r="4" stroke="currentColor" strokeWidth="1" />
        <circle className="art-marker" cx="262" cy="219" r="3" stroke="currentColor" strokeWidth=".9" />
      </svg>
      <span className="art-coordinate">{connection ? "02 / CONNECTION" : reflection ? "03 / REFLECTION" : "01 / PERSONALITY"}</span>
    </div>
  );
}
