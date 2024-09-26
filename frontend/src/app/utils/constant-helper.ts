import { ElementCategory } from "../models/types/element-category";
import { Fence } from "../models/types/fence";

export class ConstantHelper {
    public static readonly entranceWidth: number = 1.6;
    
    public static readonly pavementCategory: ElementCategory = 'Pavement';
    public static readonly treeCategory: ElementCategory = 'Tree';
    public static readonly bushCategory: ElementCategory = 'Bush';
    public static readonly flowerCategory: ElementCategory = 'Flower';

    public static readonly citySidewalkWidth: number = 2;
    public static readonly citySidewalkHeight: number = .15;
    public static readonly cityGrassWidth: number = .8;
    public static readonly cityGrassDepth: number = 1.1;
    public static readonly cityGrassHeight: number = .3;
    public static readonly cityKerbWidth: number = .2;
    public static readonly cityStreetWidth: number = 5;
    public static readonly cityBuildingAngledWallWidth: number = Math.sqrt(Math.pow(ConstantHelper.citySidewalkWidth, 2) + Math.pow(ConstantHelper.citySidewalkWidth, 2));
    public static readonly cityBuildingBottomHeight: number = 3.3;
    public static readonly cityBuildingTopHeight: number = 30;
    public static readonly cityBuildingFloorHeight: number = 3.1;
    public static readonly cityBuildingTopPartOffset: number = .5;
    public static readonly cityDoorWidth: number = 1.3;
    public static readonly cityDoorHeight: number = 2.04;
    public static readonly cityWindowWidth: number = 1.2
    public static readonly cityWindowHeight: number = 1.5;

    public static getFenceByType(fenceType: string) {
        if (fenceType == "wooden") return ConstantHelper.woodenFence;
        if (fenceType == "hedge") return ConstantHelper.hedge;
        if (fenceType == "wire") return ConstantHelper.wireFence;
        throw new Error('Fence Not Found');
    }

    // wooden fence 3d model link: https://www.cgtrader.com/free-3d-models/exterior/other/cc0-wood-fence
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

    // hedge 3d model link: https://sketchfab.com/3d-models/boxwood-f0efd57011404e1b9ff14e89f7ecb305
    private static readonly hedge: Fence = {
        height: 2,
        width: 2,
        depth: .6,
        destination: {
            folderName: 'hedge',
            fileName: 'scene.gltf'
        },
        positionZ: 0
    };

    // wire fence model link: https://sketchfab.com/3d-models/fence-445-94a4d42ac65c4fe89c36946651843719
    private static readonly wireFence: Fence = {
        height: 3,
        width: 3,
        depth: .05,
        destination: {
            folderName: 'wire fence',
            fileName: 'scene.gltf'
        },
        positionZ: 0
    };
}