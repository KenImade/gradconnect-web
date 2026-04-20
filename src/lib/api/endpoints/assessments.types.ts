/**
 * Assessment domain types.
 * Matches the Go backend's data.AssessmentProfile struct.
 */

export type AssessmentStage = {
    order: number;
    stage_name: string;
    stage_type: "form" | "test" | "interview" | "assessment" | "other";
    description: string;
};

export type AssessmentProfile = {
    id: string;
    employer_id: string;
    programme_type: string;
    stages: AssessmentStage[];
    aptitude_test_provider: string | null;
    interview_format: string | null;
    timeline_weeks: number | null;
    prep_guide: string | null;
    version: number;
    created_at: string;
    updated_at: string;
};