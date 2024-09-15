import { ElementCategory } from "../types/element-category";

export interface IGardenElement {
    id: number;
    name: string;
    category: ElementCategory;
    x: number;
    y: number;
    rotationX?: number;
    rotationY?: number;
}