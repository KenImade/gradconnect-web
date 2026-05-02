"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import type { TimeSeriesPoint } from "@/lib/api/endpoints/admin-analytics.types";

type Props = {
    title: string;
    description?: string;
    data: TimeSeriesPoint[];
    /** Total over the window — shown next to the title for context. */
    total?: number;
};

export function TimeSeriesChart({ title, description, data, total }: Props) {
    // Convert YYYY-MM-DD to short labels for the X axis (e.g. "23 Apr").
    // Keep the original date around for the tooltip's full label.
    const chartData = data.map((point) => ({
        ...point,
        label: formatShortDate(point.date),
    }));

    return (
        <div className="rounded-lg border border-admin-border bg-admin-surface p-5">
            <header className="flex items-baseline justify-between gap-2">
                <h3 className="font-display text-heading-sm text-admin-foreground">
                    {title}
                </h3>
                {typeof total === "number" && (
                    <p className="text-body-sm tabular-nums text-admin-text-dim">
                        {total.toLocaleString()}{" "}
                        <span className="text-caption text-admin-text-faint">
                            in 30 days
                        </span>
                    </p>
                )}
            </header>
            {description && (
                <p className="mt-1 text-caption text-admin-text-faint">
                    {description}
                </p>
            )}

            <div className="mt-4 h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={chartData}
                        margin={{ top: 8, right: 8, bottom: 0, left: -16 }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="var(--color-admin-border)"
                            vertical={false}
                        />
                        <XAxis
                            dataKey="label"
                            tick={{
                                fill: "var(--color-admin-text-faint)",
                                fontSize: 11,
                            }}
                            tickLine={false}
                            axisLine={false}
                            interval="preserveStartEnd"
                            minTickGap={32}
                        />
                        <YAxis
                            tick={{
                                fill: "var(--color-admin-text-faint)",
                                fontSize: 11,
                            }}
                            tickLine={false}
                            axisLine={false}
                            allowDecimals={false}
                            width={32}
                        />
                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{
                                stroke: "var(--color-admin-border)",
                                strokeWidth: 1,
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="count"
                            stroke="var(--color-primary)"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 4 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

function CustomTooltip({
    active,
    payload,
}: {
    active?: boolean;
    payload?: Array<{ value: number; payload: { date: string } }>;
}) {
    if (!active || !payload?.length) return null;

    const point = payload[0];
    return (
        <div className="rounded border border-admin-border bg-admin-surface px-2.5 py-1.5 shadow-sm">
            <p className="text-caption text-admin-text-dim">
                {formatLongDate(point.payload.date)}
            </p>
            <p className="text-body-sm font-medium tabular-nums text-admin-foreground">
                {point.value.toLocaleString()}
            </p>
        </div>
    );
}

function formatShortDate(iso: string): string {
    return new Date(iso).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
    });
}

function formatLongDate(iso: string): string {
    return new Date(iso).toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}