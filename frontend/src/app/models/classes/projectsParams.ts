import { User } from "../interfaces/user";

export class ProjectsParams {
    username: string;
    pageNumber: number = 1;
    pageSize: number = 5;

    constructor(user: User) {
        this.username = user.username;
    }
}