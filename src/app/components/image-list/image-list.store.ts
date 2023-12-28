import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { switchMap, catchError, Observable, EMPTY, withLatestFrom, map } from 'rxjs';
import { Injectable } from '@angular/core';
import { ItemInfo } from '../../dto/item-info';
import { HttpClient } from '@angular/common/http';
import { GalleryLayoutService } from '../../services/gallery-layout.service';

export interface ImagesState {
    images: ItemInfo[];
}

export interface ListItemsQuery {
    parentId: number;
    take: number;
    skip: number;
}

@Injectable()
export class ImageListStore extends ComponentStore<ImagesState> {
    constructor(private httpClient: HttpClient, private readonly galleryLayoutService: GalleryLayoutService) {
        super({ images: [] });
    }

    readonly fetchImages = this.effect((query$: Observable<ListItemsQuery>) => {
        return query$.pipe(
            withLatestFrom(this.select((state) => state.images)),
            switchMap(([query, images]) => {
                const take = query.take ?? 10;
                const skip = query.skip ?? images.length ?? 0;
                const extensions = ['.jpg', '.jpeg'].map((x) => `&extensions=${x}`).join('');
                const url = `http://localhost:5279/Images/ListItems?parentId=${query.parentId}&take=${take}&skip=${skip}${extensions}`;

                return this.httpClient.get<ItemInfo[]>(url).pipe(
                    tapResponse(
                        (imageList) => {
                            if (imageList?.length) {
                                this.addItems(imageList);
                            }
                        },
                        (error) => {
                            throw error;
                        }
                    )
                );
            }),
            catchError((error) => {
                console.log(`Oops! An API access error! ${JSON.stringify(error)}`);
                return EMPTY;
            })
        );
    });

    private readonly addItems = this.updater((state, items: ItemInfo[]) => ({
        images: [...state.images, ...items],
    }));

    readonly resizeRows = (rowWidth$: Observable<number>) => {
        return rowWidth$.pipe(
            switchMap((size) =>
                this.select((state) => state.images).pipe(
                    map((images) => this.galleryLayoutService.groupIntoRows(images, size))
                )
            )
        );
    };
}
