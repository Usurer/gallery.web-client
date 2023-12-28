import { ItemInfo } from "../../dto/item-info";

export type RowInfo = {
    row: ItemInfo[];
    visible: boolean;
    rowHeight: number;
};