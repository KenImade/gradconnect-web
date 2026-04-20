export class APIError extends Error {
    constructor(
        public status: number,
        public code: string,
        message: string,
        public details?: Array<{ field: string; message: string }>,
    ) {
        super(message);
        this.name = "APIError";
    }

    static isAPIError(err: unknown): err is APIError {
        return err instanceof APIError
    }
}