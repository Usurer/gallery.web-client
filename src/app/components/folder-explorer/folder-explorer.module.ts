import { NgModule } from '@angular/core';
import { FolderExplorerComponent } from './folder-explorer.component';
import { ImageListModule } from '../image-list/image-list.module';
import { FolderExplorerRoutingModule } from './folder-explorer.routing.module';

@NgModule({
    declarations: [FolderExplorerComponent],
    exports: [FolderExplorerComponent],
    imports: [
        FolderExplorerRoutingModule,
        ImageListModule
    ],
})
export class FolderExplorerModule {}
