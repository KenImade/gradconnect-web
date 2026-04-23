type Props = { className?: string };

export function BuildingFacade({ className }: Props) {
    return (
        <svg
            viewBox="0 0 480 480"
            className={className}
            role="img"
            aria-label="An institutional building facade with scattered lit windows"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            {/* Main building silhouette */}
            <path
                d="M 80 440 L 80 100 L 320 100 L 320 440 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
            />

            {/* Window grid — 4 cols × 5 rows */}
            {[120, 168, 216, 264].map((y) =>
                [104, 160, 216, 272].map((x) => (
                    <rect
                        key={`${x}-${y}`}
                        x={x}
                        y={y}
                        width={40}
                        height={36}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                    />
                )),
            )}
            {/* Two lit windows with the spot-color fill */}
            <rect x="160" y="120" width="40" height="36" fill="var(--color-primary)" />
            <rect x="216" y="216" width="40" height="36" fill="var(--color-primary)" />

            {/* Door */}
            <rect
                x="180"
                y="400"
                width="40"
                height="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
            />
            <line
                x1="200"
                y1="400"
                x2="200"
                y2="440"
                stroke="currentColor"
                strokeWidth="1.5"
            />

            {/* Ground line */}
            <line
                x1="20"
                y1="440"
                x2="460"
                y2="440"
                stroke="currentColor"
                strokeWidth="2.5"
            />

            {/* Second building in background */}
            <path
                d="M 360 440 L 360 160 L 450 160 L 450 440"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
            />
            {[190, 230, 270, 310, 350, 390].map((y) => (
                <line
                    key={y}
                    x1="376"
                    y1={y}
                    x2="434"
                    y2={y}
                    stroke="currentColor"
                    strokeWidth="1.5"
                />
            ))}

            {/* Sun */}
            <circle
                cx="40"
                cy="100"
                r="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
            />
        </svg>
    );
}