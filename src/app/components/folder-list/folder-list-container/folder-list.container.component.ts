import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FolderListStore } from '../folder-list.store';
import { Observable } from 'rxjs';
import { FolderInfo } from '../../../dto/folder-info';

@Component({
    selector: 'glr-folder-list-container',
    templateUrl: './folder-list.container.component.html',
    styleUrls: ['./folder-list.container.component.scss'],
    providers: [FolderListStore],
})
export class FolderListContainerComponent implements OnInit {
    @Input()
    rootId!: number;

    @Output()
    folderSelected = new EventEmitter<number>();

    public folders$: Observable<FolderInfo[]> = this.folderStore.select((x) => x.folders);

    constructor(private folderStore: FolderListStore) {}

    ngOnInit(): void {
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
