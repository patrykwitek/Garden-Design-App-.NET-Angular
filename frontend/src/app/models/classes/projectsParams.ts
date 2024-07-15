import { IUser } from "../interfaces/i-user";

export class ProjectsParams {
    username: string;
    pageNumber: number = 1;
    pageSize: number = 5;

    constructor(user: IUser) {
        this.username = user.username;
    }
}