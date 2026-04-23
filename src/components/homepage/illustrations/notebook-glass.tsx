type Props = { className?: string };

export function NotebookGlass({ className }: Props) {
    return (
        <svg
            viewBox="0 0 280 200"
            className={className}
            role="img"
            aria-label="An open notebook with a pen and a chilled glass of water beside it"
        >
            {/* Open notebook — two facing pages in perspective */}
            <path
                d="M 10 170 L 30 150 L 170 150 L 170 170 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M 10 170 L 30 150 L 30 70 L 10 90 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M 170 170 L 170 90 L 150 70 L 150 150 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Center spine */}
            <line x1="90" y1="70" x2="90" y2="150" stroke="currentColor" strokeWidth="1.25" />

            {/* Top edge of pages — suggesting perspective */}
            <path
                d="M 30 70 Q 90 60 150 70"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.75"
            />

            {/* Text lines on left page */}
            {[90, 102, 114, 126, 138].map((y, i) => (
                <line
                    key={`l-${y}`}
                    x1="40"
                    y1={y}
                    x2={i === 4 ? 65 : i === 2 ? 75 : 80}
                    y2={y}
                    stroke="currentColor"
                    strokeWidth="0.75"
                />
            ))}

            {/* Text lines on right page */}
            {[88, 100, 112, 124].map((y, i) => (
                <line
                    key={`r-${y}`}
                    x1="100"
                    y1={y}
                    x2={i === 3 ? 135 : 142}
                    y2={y}
                    stroke="currentColor"
                    strokeWidth="0.75"
                />
            ))}

            {/* Pen resting on the right page at an angle */}
            <g transform="translate(100, 140) rotate(18)">
                <line x1="0" y1="0" x2="60" y2="0" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
                <path d="M 55 -2 L 62 0 L 55 2 Z" fill="var(--color-primary)" />
            </g>

            {/* Chilled glass of water to the right */}
            <g transform="translate(190, 80)">
                {/* Glass — tapered tumbler */}
                <path
                    d="M 4 0 L 52 0 L 48 80 L 8 80 Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinejoin="round"
                />
                {/* Water surface ellipse */}
                <ellipse
                    cx="28"
                    cy="15"
                    rx="22"
                    ry="3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.75"
                />
                {/* Ice cube 1 */}
                <rect
                    x="14"
                    y="28"
                    width="14"
                    height="14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.75"
                    transform="rotate(15 21 35)"
                />
                {/* Ice cube 2 */}
                <rect
                    x="28"
                    y="42"
                    width="12"
                    height="12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.75"
                    transform="rotate(-8 34 48)"
                />
                {/* Water line at bottom indicating level */}
                <line
                    x1="10"
                    y1="60"
                    x2="46"
                    y2="60"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    strokeDasharray="2 2"
                />
                {/* Base ellipse */}
                <ellipse
                    cx="28"
                    cy="80"
                    rx="20"
                    ry="3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.75"
                />
                {/* Single condensation droplet in primary */}
                <circle cx="52" cy="45" r="2" fill="var(--color-primary)" />
            </g>
        </svg>
    );
}