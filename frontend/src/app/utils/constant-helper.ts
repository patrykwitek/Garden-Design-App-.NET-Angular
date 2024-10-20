import { ElementCategory } from "../models/types/element-category";
import { Fence } from "../models/types/fence";
import { Tree3DModelData } from "../models/types/tree-3d-model-data";

export class ConstantHelper {
    public static readonly entranceWidth: number = 1.6;

    public static readonly minGardenWidth: number = 5;
    public static readonly maxGardenWidth: number = 300;

    public static readonly minDistanceFromTree: number = 4;
    public static readonly minDistanceFromBush: number = 2;
    public static readonly minDistanceFromFlower: number = .6;

    public static readonly pavementCategory: ElementCategory = 'Pavement';
    public static readonly treeCategory: ElementCategory = 'Tree';
    public static readonly bushCategory: ElementCategory = 'Bush';
    public static readonly flowerCategory: ElementCategory = 'Flower';
    public static readonly benchCategory: ElementCategory = 'Bench';

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
        throw new Error('Fence not found');
    }

    public static get3DModelData(elmentName: string): Tree3DModelData {
        switch (elmentName) {
            case "Pine": {
                return ConstantHelper.pine;
                break;
            }
            case "Oak": {
                return ConstantHelper.oak;
                break;
            }
            case "Birch": {
                return ConstantHelper.birch;
                break;
            }
            case "Juniper": {
                return ConstantHelper.juniper;
                break;
            }
            case "Yew": {
                return ConstantHelper.yew;
                break;
            }
            case "Salix caprea": {
                return ConstantHelper.salixCaprea;
                break;
            }
            case "Tulip": {
                return ConstantHelper.tulip;
                break;
            }
            case "Crocus": {
                return ConstantHelper.crocus;
                break;
            }
            case "Narcissus": {
                return ConstantHelper.narcissus;
                break;
            }
            default: {
                throw new Error('Element not found');
                break;
            }
        }
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

    private static readonly pine: Tree3DModelData = {
        fileName: 'pine-1',
        fileExtension: 'gltf',
        width: 8,
        depth: 8,
        height: 10
    };

    private static readonly oak: Tree3DModelData = {
        fileName: 'oak',
        fileExtension: 'glb',
        width: 12,
        depth: 12,
        height: 13
    };

    private static readonly birch: Tree3DModelData = {
        fileName: 'birch',
        fileExtension: 'gltf',
        width: 8,
        depth: 8,
        height: 10
    };

    // juniper model link: https://sketchfab.com/3d-models/bush-490fb2c6fcd2408290f667436730020e
    private static readonly juniper: Tree3DModelData = {
        fileName: 'juniper',
        fileExtension: 'gltf',
        width: 3,
        depth: 4,
        height: 3
    };

    private static readonly yew: Tree3DModelData = {
        fileName: 'yew',
        fileExtension: 'gltf',
        width: 3,
        depth: 3,
        height: 4
    };

    // salix caprea model link: https://sketchfab.com/3d-models/green-bush-53fc57039ada4414b5aa8eba6c663fe2
    private static readonly salixCaprea: Tree3DModelData = {
        fileName: 'salix caprea',
        fileExtension: 'gltf',
        width: 3,
        depth: 3,
        height: 3
    };

    // crocus model link: https://sketchfab.com/3d-models/generic-tulip-flower-d75f531255ad47a99051a4c421c8861b
    private static readonly crocus: Tree3DModelData = {
        fileName: 'crocus',
        fileExtension: 'gltf',
        width: .4,
        depth: .3,
        height: 1
    };
    
    // narcissus model link: https://sketchfab.com/3d-models/generic-narcissus-flower-cf16e483ce7b4b9281b62366d9b1e52c
    private static readonly narcissus: Tree3DModelData = {
        fileName: 'narcissus',
        fileExtension: 'gltf',
        width: .6,
        depth: .6,
        height: 1
    };
    
    // tulip model link: https://sketchfab.com/3d-models/tulip-5908b2665e58414a8dbc70e20c7ee021
    private static readonly tulip: Tree3DModelData = {
        fileName: 'tulip',
        fileExtension: 'gltf',
        width: .3,
        depth: .3,
        height: .95
    };
}