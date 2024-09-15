import { ElementCategory } from "../models/types/element-category";
import { Fence } from "../models/types/fence";

export class ConstantHelper {
    public static readonly entranceWidth: number = 1.6;
    
    public static readonly pavementCategory: ElementCategory = 'Pavement';
    public static readonly treeCategory: ElementCategory = 'Tree';
    public static readonly bushCategory: ElementCategory = 'Bush';

    public static getFenceByType(fenceType: string) {
        if (fenceType == "wooden") return ConstantHelper.woodenFence;
        if (fenceType == "hedge") return ConstantHelper.hedge;
        throw new Error('Fence Not Found');
    }

    private static readonly woodenFence: Fence = {
        height: 1.5,
        width: 2,
        depth: .05,
        destination: {
            folderName: 'wooden fence',
            fileName: 'scene.gltf'
        },
        positionZ: 1.5 / 2
    };

    private static readonly hedge: Fence = {
        height: .8,
        width: 1.8,
        depth: .3,
        destination: {
            folderName: 'hedge',
            fileName: '10449_Rectangular_Box_Hedge_v1_iterations-2.obj'
        },
        positionZ: .8 / 2
    };
}