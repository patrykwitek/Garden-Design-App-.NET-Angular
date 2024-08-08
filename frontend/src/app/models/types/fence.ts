export type Fence = {
    height: number,
    width: number,
    depth: number,
    destination: {
        folderName: string,
        fileName: string
    },
    positionZ: number
};