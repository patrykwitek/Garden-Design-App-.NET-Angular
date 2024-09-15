import { ElementCategory } from "../types/element-category";

export interface IGardenElement {
    id: number;
    name: string;
    category: ElementCategory;
    positionX: number;
    positionY: number;
    rotationX?: number;
    rotationY?: number;
}