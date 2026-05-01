export type ImportType = "employers" | "opportunities" | "assessments";

export type ImportStatus = "pending" | "processing" | "completed" | "failed";

export type ImportRowError = {
    row_number: number;
    message: string;
    raw_data: string;
};

export type ImportJob = {
    id: string;
    import_type: ImportType;
    status: ImportStatus;
    rows_total: number | null;
    rows_imported: number | null;
    rows_failed: number | null;
    error_message: string | null;
    row_errors: ImportRowError[] | null;
    created_at: string;
    completed_at: string | null;
};