import { Language } from "../types/language";

export interface IUser {
    username: string;
    token: string;
    language: Language;
}