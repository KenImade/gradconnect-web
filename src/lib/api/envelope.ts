/**
 * Every successful API response is wrapped in a data envelope.
 * List responses additionally include a pagination object.
 */

export type Envelope<T> = {
    data: T;
};

export type PaginatedEnvelope<T> = {
    data: T;
    pagination: PaginationMetadata;
};

export type PaginationMetadata = {
    current_page: number;
    page_size: number;
    first_page: number;
    last_page: number;
    total_records: number;
};