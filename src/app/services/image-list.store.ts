import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { fromFetch } from 'rxjs/fetch';
import { switchMap, catchError, Observable, EMPTY, withLatestFrom } from 'rxjs';
import { Injectable } from '@angular/core';
import { ItemInfo } from '../dto/item-info';

export interface ImagesState {
    images: ItemInfo[];
}

export interface ListItemsQuery {
    parentId: number;
    take: number;
    skip: number;
}

@Injectable({
    providedIn: 'root',
})
export class ImageListStore extends ComponentStore<ImagesState> {
    constructor() {
        super({ images: [] });
    }

    readonly getImages = this.effect((query$: Observable<ListItemsQuery>) => {
        return query$.pipe(
            withLatestFrom(this.select((state) => state.images)),
            switchMap(([query, images]) => {
                return fromFetch(
                    `http://localhost:5279/Images/ListItems?parentId=${query.parentId}&take=${query.take ?? 10}&skip=${
                        query.skip ?? images.length ?? 0
                    }`,
                    {
                        cache: 'force-cache',
                    }
                ).pipe(
                    tapResponse(
                        // TODO: Can we do it in a better way pls?
                        (imageList) =>
                            imageList.json().then((x: ItemInfo[]) => {
                                if (x && x.length > 0) {
                                    this.addItems(
                                        x.filter(
                                            (k) =>
                                                k.name.toLowerCase().endsWith('jpg') ||
                                                k.name.toLowerCase().endsWith('jpeg')
                                        )
                                    );
                                }
                            }),
                        (error) => {
                            console.log(error);
                        }
                    )
                );
            }),
            catchError((err) => {
                console.log(`Oops! An API access error! ${err}`);
                return EMPTY;
            })
        );
    });

    readonly addItems = this.updater((state, items: ItemInfo[]) => ({
        images: [...state.images, ...items],
    }));
}
