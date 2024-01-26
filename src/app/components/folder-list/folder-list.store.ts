import { Injectable } from '@angular/core';
import { FolderInfo } from '../../dto/folder-info';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { HttpClient } from '@angular/common/http';
import { ListItemsQuery } from '../../common/list-items-query';
import { EMPTY, Observable, catchError, switchMap, withLatestFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

interface FolderState {
    folders: FolderInfo[];
}

@Injectable()
export class FolderListStore extends ComponentStore<FolderState> {
    constructor(private httpClient: HttpClient) {
        super({ folders: [] });
    }

    readonly fetchFolders = this.effect((query$: Observable<ListItemsQuery>) => {
        return query$.pipe(
            withLatestFrom(this.select((state) => state.folders)),
            switchMap(([query, folders]) => {
                const take = query.take ?? 10;
                const skip = query.skip ?? folders.length ?? 0;
                const url = `${environment.foldersApiUri}/ListItems/${query.parentId}?take=${take}&skip=${skip}`;

                return this.httpClient.get<FolderInfo[]>(url).pipe(
                    tapResponse(
                        (folders) => {
                            this.setItems(folders);
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

    private setItems = this.updater((state, items: FolderInfo[]) => ({
        folders: items,
    }));
}
