import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { fromFetch } from 'rxjs/fetch';
import { switchMap, of, catchError } from 'rxjs';

export interface ImagesState {
    images: []
}

export class ImagesStore extends ComponentStore<ImagesState> {
    
    constructor() {
        super({ images: []});
    }

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