import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'glr-folder-explorer',
    templateUrl: './folder-explorer.component.html',
    styleUrls: ['./folder-explorer.component.scss'],
})
export class FolderExplorerComponent {
    @Input()
    rootId!: number;

    constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

    onFolderSelected(folderId: number): void {
        console.log(`select ${folderId}`);
        if (folderId !== this.rootId) {
            this.router.navigate(['../', folderId], { relativeTo: this.activatedRoute });
        }
    }
}
