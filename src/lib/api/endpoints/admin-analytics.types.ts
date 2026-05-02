export type AnalyticsCounts = {
    users_total: number;
    users_verified: number;
    users_registered_last_7_days: number;
    employers_total: number;
    employers_verified: number;
    opportunities_total: number;
    opportunities_open: number;
    reviews_total: number;
    reviews_pending_moderation: number;
    bookmarks_total: number;
    applications_total: number;
    sessions_active: number;
};

export type TimeSeriesPoint = {
    date: string;  // YYYY-MM-DD
    count: number;
};

export type AnalyticsTimeSeries = {
    registrations: TimeSeriesPoint[];
    bookmarks: TimeSeriesPoint[];
    reviews_submitted: TimeSeriesPoint[];
};

export type TopEmployer = {
    id: string;
    name: string;
    slug: string;
    bookmark_count: number;
    review_count: number;
    opportunity_count: number;
};

export type TopOpportunity = {
    id: string;
    title: string;
    slug: string;
    employer_name: string;
    bookmark_count: number;
    deadline: string | null;
};

export type RecentJob = {
    job_name: string;
    last_run_at: string;
    last_run_enqueued: number;
    last_run_status: "completed" | "running";
    completed_at?: string | null;
};

export type AnalyticsResponse = {
    counts: AnalyticsCounts;
    time_series: AnalyticsTimeSeries;
    top_employers: TopEmployer[];
    top_opportunities: TopOpportunity[];
    recent_jobs: RecentJob[];
};

// Job types — used by the trigger buttons. Mirror backend route paths.
export type AdminJobName =
    | "deadline_reminders"
    | "recalculate_ratings"
    | "cleanup_sessions";

export type JobTriggerResponse = {
    enqueued?: number;       // deadline-reminders
    recalculated?: number;   // recalculate-ratings
    deleted?: number;        // cleanup-sessions
    message: string;
};