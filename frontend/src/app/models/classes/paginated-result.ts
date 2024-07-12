import { IPagination } from "../interfaces/i-pagination";

export class PaginatedResult<T> {
    result?: T;
    pagination?: IPagination;
}