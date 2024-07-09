export interface User {
    username: string;
    token: string;
    role: Role;
}

type Role = "admin" | "user";