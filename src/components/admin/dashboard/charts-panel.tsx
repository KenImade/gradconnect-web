import { TimeSeriesChart } from "./time-series-chart";
import type { AnalyticsTimeSeries } from "@/lib/api/endpoints/admin-analytics.types";

type Props = {
    timeSeries: AnalyticsTimeSeries;
};

function sumCounts(series: { count: number }[]): number {
    return series.reduce((acc, p) => acc + p.count, 0);
}

export function ChartsPanel({ timeSeries }: Props) {
    return (
        <div className="grid gap-4 lg:grid-cols-3">
            <TimeSeriesChart
                title="Registrations"
                description="New user accounts created daily"
                data={timeSeries.registrations}
                total={sumCounts(timeSeries.registrations)}
            />
            <TimeSeriesChart
                title="Bookmarks"
                description="Opportunities saved by users"
                data={timeSeries.bookmarks}
                total={sumCounts(timeSeries.bookmarks)}
            />
            <TimeSeriesChart
                title="Reviews submitted"
                description="Community contributions per day"
                data={timeSeries.reviews_submitted}
                total={sumCounts(timeSeries.reviews_submitted)}
            />
        </div>
    );
}