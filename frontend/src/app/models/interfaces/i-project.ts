import { IGround } from "./i-ground";

export interface IProject {
    id?: string;
    name: string;
    dateCreated?: string;
    width: number;
    depth: number;
    ground: IGround;
    ownerUsername?: string;
}