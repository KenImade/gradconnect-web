type Props = { className?: string };

export function CalendarPage({ className }: Props) {
    return (
        <svg
            viewBox="0 0 240 240"
            className={className}
            role="img"
            aria-label="A calendar page with one date circled"
        >
            {/* Calendar page */}
            <rect
                x="30"
                y="30"
                width="180"
                height="180"
                rx="3"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Spiral binding */}
            {[60, 100, 140, 180].map((cx) => (
                <circle
                    key={cx}
                    cx={cx}
                    cy="30"
                    r="4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.75"
                />
            ))}

            {/* Header bar */}
            <line
                x1="30"
                y1="62"
                x2="210"
                y2="62"
                stroke="currentColor"
                strokeWidth="1.25"
            />

            {/* Month label suggestion */}
            <line
                x1="46"
                y1="50"
                x2="90"
                y2="50"
                stroke="currentColor"
                strokeWidth="0.75"
            />

            {/* Day-of-week small marks */}
            {[52, 82, 112, 142, 172, 202].map((x) => (
                <line
                    key={x}
                    x1={x}
                    y1="74"
                    x2={x + 8}
                    y2="74"
                    stroke="currentColor"
                    strokeWidth="0.75"
                />
            ))}

            {/* Date grid */}
            {[98, 122, 146, 170, 194].map((y, rowIdx) => {
                const xs = [56, 86, 116, 146, 176, 206];
                return xs.map((x, colIdx) => {
                    // Skip last 3 of final row for realism
                    if (rowIdx === 4 && colIdx >= 3) return null;

                    // Circle the date at row 2 col 2 (the marked deadline)
                    if (rowIdx === 2 && colIdx === 2) {
                        return (
                            <g key={`${x}-${y}`}>
                                <circle
                                    cx={x}
                                    cy={y}
                                    r="10"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.25"
                                />
                                <circle cx={x} cy={y} r="2.5" fill="var(--color-primary)" />
                            </g>
                        );
                    }

                    return (
                        <circle
                            key={`${x}-${y}`}
                            cx={x}
                            cy={y}
                            r="2"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="0.75"
                        />
                    );
                });
            })}
        </svg>
    );
}