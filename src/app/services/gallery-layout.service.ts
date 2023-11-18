/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Injectable } from "@angular/core";
import { ItemInfo } from "../dto/item-info";
import { raceWith } from "rxjs";

export type Row = ItemInfo[];

@Injectable({
    providedIn: 'root'
})
export class GalleryLayoutService {
    
    public defineRows(images: ItemInfo[], containerWidth: number): Row[] {
        performance.mark('define-rows-start');
        
        const rows: Row[] = [];

        let buffer: ItemInfo[] = [];
        let lineWidth = 0;

        const rowHeight = 200;

        for(let i = 0; i < images.length; i++) {
            const current = images[i];
            const next = i < images.length - 1 ? images[i + 1] : current;

            if (!current.width || !current.height) 
                continue;
            
            const ratio = current.width / current.height;

            const resizedWidth = ratio * rowHeight;
            const diff = lineWidth + resizedWidth - containerWidth;

            current.width = resizedWidth;
            current.height = rowHeight;

            if (diff <= 0) {
                // We can safely add current img to the row
                lineWidth = lineWidth + resizedWidth;
                buffer.push(current);
            } else {
                // The resulting row size is greater than the row size, but not too much
                // We can make all images smaller
                if (diff < resizedWidth / 2) {
                    buffer.push(current);
                    buffer = this.resizeBufferToSmaller(buffer, containerWidth);
                    rows.push(buffer);
                    buffer = [];
                    lineWidth = 0;
                } else {
                    // the resulting row width is too big, so we don't want to add this image
                    // instead make all previous images bigger
                    buffer = this.resizeBufferToBigger(buffer, containerWidth);
                    rows.push(buffer);
                    buffer = [current];
                    lineWidth = current.width;
                }
            }
        }

        performance.mark('define-rows-end');
        const perf = performance.measure('my-measure', 'define-rows-start', 'define-rows-end');
        // console.log(perf.duration);

        return rows;

    }

    public resizeBufferToSmaller(row: ItemInfo[], containerWidth: number): ItemInfo[] {
        // const widths = new Array<number>(buffer.length);
        const currentRowWidth = row.reduce((acc, item) => acc + (item.width ?? 0), 0)
        const ratio = currentRowWidth / containerWidth; // should be > 1
        const resizedImages = row.map(x => {
            return {
                ...x,
                height: (x.height ?? 0) / ratio,
                width: (x.width ?? 0) / ratio,
            }
        });

        return resizedImages;
    }

    // It's identical to the resizeBufferToSmaller
    public resizeBufferToBigger(row: ItemInfo[], containerWidth: number): ItemInfo[] {
        const currentRowWidth = row.reduce((acc, item) => acc + (item.width ?? 0), 0)
        const ratio = currentRowWidth / containerWidth; // should be < 1
        const resizedImages = row.map(x => {
            return {
                ...x,
                height: (x.height ?? 0) / ratio,
                width: (x.width ?? 0) / ratio,
            }
        });

        return resizedImages;
    }
}