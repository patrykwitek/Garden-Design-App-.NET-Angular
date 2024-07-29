import { Language } from "../types/language";

export interface IUser {
    username: string;
    token: string;
    role: Role;
    language: Language;
}

type Role = "admin" | "user";