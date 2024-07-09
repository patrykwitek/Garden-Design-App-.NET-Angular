import { Pagination } from "../interfaces/pagination";

export class PaginatedResult<T> {
    result?: T;
    pagination?: Pagination;
}