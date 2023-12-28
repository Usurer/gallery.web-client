import { Component, Input } from '@angular/core';

@Component({
    selector: 'glr-folder-explorer',
    templateUrl: './folder-explorer.component.html',
    styleUrls: ['./folder-explorer.component.scss'],
})
export class FolderExplorerComponent {
    @Input()
    rootId!: number;
}
