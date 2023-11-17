// TODO: Refactor API so that image items would have not nullable Width and Height
export interface ItemInfo {
    id: number,
    name: string,
    isFolder: boolean,
    width?: number,
    height?: number
}