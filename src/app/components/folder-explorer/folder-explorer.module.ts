import { NgModule } from '@angular/core';
import { FolderExplorerComponent } from './folder-explorer.component';
import { ImageListModule } from '../image-list/image-list.module';
import { FolderExplorerRoutingModule } from './folder-explorer.routing.module';
import { FolderListModule } from '../folder-list/folder-list.module';

@NgModule({
    declarations: [FolderExplorerComponent],
    exports: [FolderExplorerComponent],
    imports: [FolderExplorerRoutingModule, ImageListModule, FolderListModule],
})
export class FolderExplorerModule {}
