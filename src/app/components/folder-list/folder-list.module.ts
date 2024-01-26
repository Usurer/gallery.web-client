import { NgModule } from '@angular/core';
import { FolderListContainerComponent } from './folder-list-container/folder-list.container.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
    declarations: [FolderListContainerComponent],
    exports: [FolderListContainerComponent],
    imports: [CommonModule, MatIconModule],
})
export class FolderListModule {}
