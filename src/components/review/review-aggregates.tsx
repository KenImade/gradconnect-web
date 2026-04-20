import { RatingDots } from "./rating-dots";

type Props = {
    reviewCount: number;
    avgDifficulty: number | null;
    avgExperience: number | null;
};

export function ReviewAggregates({ reviewCount, avgDifficulty, avgExperience }: Props) {
    return (
        <div className="rounded-lg border border-border bg-surface-subtle p-6">
            <p className="font-display text-heading-md text-foreground">
                {reviewCount}{" "}
                {reviewCount === 1 ? "community review" : "community reviews"}
            </p>

            {reviewCount > 0 && avgDifficulty !== null && avgExperience !== null && (
                <dl className="mt-4 grid grid-cols-2 gap-6">
                    <div>
                        <dt className="text-caption uppercase tracking-wide text-text-faint">
                            Avg. difficulty
                        </dt>
                        <dd className="mt-2 flex items-center gap-3">
                            <RatingDots
                                value={avgDifficulty}
                                label="Average difficulty"
                                size="md"
                            />
                            <span className="text-body-sm font-medium text-foreground">
                                {avgDifficulty.toFixed(1)}/5
                            </span>
                        </dd>
                    </div>
                    <div>
                        <dt className="text-caption uppercase tracking-wide text-text-faint">
                            Avg. experience
                        </dt>
                        <dd className="mt-2 flex items-center gap-3">
                            <RatingDots
                                value={avgExperience}
                                label="Average experience"
                                size="md"
                            />
                            <span className="text-body-sm font-medium text-foreground">
                                {avgExperience.toFixed(1)}/5
                            </span>
                        </dd>
                    </div>
                </dl>
            )}
        </div>
    );
}