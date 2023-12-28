import { Injectable } from '@angular/core';
import { FolderInfo } from '../../dto/folder-info';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { HttpClient } from '@angular/common/http';
import { ListItemsQuery } from '../../common/list-items-query';
import { EMPTY, Observable, catchError, switchMap, withLatestFrom } from 'rxjs';

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
                const url = `http://localhost:5279/Folders/ListItems?parentId=${query.parentId}&take=${take}&skip=${skip}`;

                return this.httpClient.get<FolderInfo[]>(url).pipe(
                    tapResponse(
                        (folders) => {
                            if (folders?.length) {
                                this.addItems(folders);
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

    private addItems = this.updater((state, items: FolderInfo[]) => ({
        folders: [...state.folders, ...items],
    }));
}
