import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { fromFetch } from 'rxjs/fetch';
import { switchMap, of, catchError, Observable, EMPTY, skip, withLatestFrom } from 'rxjs';
import { Injectable } from "@angular/core";
import { ItemInfo } from "../dto/item-info";

export interface ImagesState {
    images: ItemInfo[]
}

@Injectable({
    providedIn: 'root'
})
export class ImageListStore extends ComponentStore<ImagesState> {
    
    constructor() {
        super({ images: []});
    }
    //http://localhost:5279/Images/GetImage?id=6

    readonly getImages = this.effect((take$: Observable<number>, ) => {
        return take$.pipe(
            withLatestFrom(this.select(state => state.images)),
            switchMap(([take, images]) => {
                return fromFetch(`http://localhost:5279/Images/ListItems?parentId=2314&take=${take ?? 10}&skip=${images.length ?? 0}`, {
                    cache: "force-cache"
                }).pipe(
                    tapResponse(
                        // TODO: Can we do it in a better way pls?
                        (imageList) => imageList.json().then((x: ItemInfo[]) => this.addItems(x) ),
                        (error) => { console.log(error) }
                    )
                )
            }),
            catchError(err => {
                console.log(`Oops! An API access error! ${err}`);
                return EMPTY;
            })
        )
    });

    readonly repeatGetImages = this.effect((take$: Observable<number>, ) => {
        return take$.pipe(
            withLatestFrom(this.select(state => state.images)),
            switchMap(([take, images]) => {
                return fromFetch(`http://localhost:5279/Images/ListItems?parentId=2314&take=${1}&skip=${0}`, {
                    cache: "default"
                }).pipe(
                    tapResponse(
                        // TODO: Can we do it in a better way pls?
                        (imageList) => imageList.json().then((x: ItemInfo[]) => this.addItems(x) ),
                        (error) => { console.log(error) }
                    )
                )
            }),
            catchError(err => {
                console.log(`Oops! An API access error! ${err}`);
                return EMPTY;
            })
        )
    });

    readonly addItems = this.updater((state, items: ItemInfo[]) => ({
        images: [...state.images, ...items],
      }));
}