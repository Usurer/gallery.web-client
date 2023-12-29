import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { FolderInfo } from '../../dto/folder-info';
import { Observable, switchMap } from 'rxjs';

interface Store {
    folders: FolderInfo[];
}

@Injectable()
export class FolderHierarchyStore extends ComponentStore<Store> {
    constructor(private httpClient: HttpClient) {
        super({ folders: [] });
    }

    readonly fetchHierarcy = this.effect((folderId$: Observable<number>) => {
        return folderId$.pipe(
            switchMap((folderId$) =>
                this.httpClient.get<FolderInfo[]>(`http://localhost:5279/Folders/GetAncestors?folderId=${folderId$}`)
            ),
            tapResponse(
                (folders) => this.setItems(folders),
                (error) => {
                    throw error;
                }
            )
        );
    });

    private setItems = this.updater((state, items: FolderInfo[]) => ({
        folders: items,
    }));
}
