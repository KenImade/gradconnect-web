import type { EmployerStub } from "./employers.types";

export type AssessmentStage = {
    order: number;
    stage_name: string;
    stage_type: string;
    description?: string;
};

export type Assessment = {
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
    employer: EmployerStub;
};