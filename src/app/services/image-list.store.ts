import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { fromFetch } from 'rxjs/fetch';
import { switchMap, of, catchError } from 'rxjs';
import { Injectable } from "@angular/core";
import { ServicesModule } from "./services.module";

export interface ImagesState {
    images: []
}

@Injectable({
    providedIn: ServicesModule
})
export class ImageListStore extends ComponentStore<ImagesState> {
    
    constructor() {
        super({ images: []});
    }
    //http://localhost:5279/Images/GetImage?id=6

    readonly getImages = this.effect<void>((trigger$) => {
        return trigger$.pipe(
            switchMap(() => {
                return fromFetch('http://localhost:5279/Images/ListItems?take=10').pipe(
                    switchMap(response => {
                        if (response.ok) {
                            return response.json();
                        } else {
                            return of({ error: true, message: `Error ${ response.status }` });
                        }
                    }),
                    tapResponse({
                        next: (data) => console.log(data),
                        error: (e) => console.log(e)
                    })
                )
            })
        )
    });
}