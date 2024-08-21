import { IEntrance } from "./i-entrance";
import { IFence } from "./i-fence";
import { IGround } from "./i-ground";

export interface IProject {
    id?: string;
    name: string;
    dateCreated?: string;
    width: number;
    depth: number;
    ground: IGround;
    fence: IFence;
    entrances: IEntrance[];
    ownerUsername?: string;
}