export interface IUser {
    username: string;
    token: string;
    role: Role;
}

type Role = "admin" | "user";