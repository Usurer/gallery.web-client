import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FoldersListStore } from '../folders-list.store';
import { Observable } from 'rxjs';
import { FolderInfo } from '../../../../dto/folder-info';

@Component({
    selector: 'glr-folders-list-container',
    templateUrl: './folders-list.container.component.html',
    styleUrls: ['./folders-list.container.component.scss'],
    providers: [FoldersListStore],
})
export class FoldersListContainerComponent implements OnChanges {
    @Input()
    rootId!: number;

    @Output()
    folderSelected = new EventEmitter<number>();

    public folders$: Observable<FolderInfo[]> = this.folderStore.select((x) => x.folders);

    constructor(private folderStore: FoldersListStore) {}

    ngOnChanges(): void {
        this.folderStore.fetchFolders({
            parentId: this.rootId,
            take: 1000,
            skip: 0,
        });
    }

    onClick(folderId: number): void {
        this.folderSelected.emit(folderId);
    }
}
