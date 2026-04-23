type IconProps = { className?: string };

/** Briefcase — "Discover employers" */
export function BriefcaseIcon({ className }: IconProps) {
    return (
        <svg
            viewBox="0 0 48 48"
            className={className}
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            role="img"
            aria-label="Briefcase"
        >
            {/* Body */}
            <rect x="6" y="16" width="36" height="26" rx="2" strokeWidth="1.5" />
            {/* Handle */}
            <path d="M 16 16 L 16 10 Q 16 8 18 8 L 30 8 Q 32 8 32 10 L 32 16" strokeWidth="1.5" />
            {/* Clasp */}
            <line x1="6" y1="26" x2="42" y2="26" strokeWidth="1" />
            {/* Dot accent */}
            <circle cx="24" cy="26" r="1.5" fill="var(--color-primary)" stroke="none" />
        </svg>
    );
}

/** Compass rose — "Understand their process" */
export function CompassIcon({ className }: IconProps) {
    return (
        <svg
            viewBox="0 0 48 48"
            className={className}
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            role="img"
            aria-label="Compass"
        >
            {/* Outer circle */}
            <circle cx="24" cy="24" r="18" strokeWidth="1.5" />
            {/* Inner directional tick marks */}
            <line x1="24" y1="8" x2="24" y2="12" strokeWidth="1" />
            <line x1="24" y1="36" x2="24" y2="40" strokeWidth="1" />
            <line x1="8" y1="24" x2="12" y2="24" strokeWidth="1" />
            <line x1="36" y1="24" x2="40" y2="24" strokeWidth="1" />
            {/* Needle — triangle pointing north in primary fill, triangle pointing south outlined */}
            <path
                d="M 24 14 L 28 24 L 24 22 L 20 24 Z"
                fill="var(--color-primary)"
                stroke="var(--color-primary)"
                strokeWidth="0.75"
            />
            <path d="M 24 34 L 28 24 L 24 26 L 20 24 Z" strokeWidth="1" />
            {/* Center pivot */}
            <circle cx="24" cy="24" r="1.5" fill="currentColor" stroke="none" />
        </svg>
    );
}

/** Pen nib — "Prepare with real intelligence" */
export function PenNibIcon({ className }: IconProps) {
    return (
        <svg
            viewBox="0 0 48 48"
            className={className}
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            role="img"
            aria-label="Pen nib"
        >
            {/* Nib body */}
            <path
                d="M 24 6 L 34 32 L 14 32 Z"
                strokeWidth="1.5"
            />
            {/* Central slit */}
            <line x1="24" y1="14" x2="24" y2="28" strokeWidth="1" />
            {/* Breather hole */}
            <circle cx="24" cy="18" r="1.5" strokeWidth="1" />
            {/* Writing tip — small primary triangle below */}
            <path
                d="M 21 32 L 27 32 L 24 42 Z"
                fill="var(--color-primary)"
                stroke="none"
            />
            {/* Ink trail suggesting writing */}
            <path
                d="M 24 44 Q 28 44 28 42"
                strokeWidth="0.75"
            />
        </svg>
    );
}