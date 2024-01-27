import { NgModule } from '@angular/core';
import { FolderExplorerComponent } from './folder-explorer.component';
import { ImageListModule } from '../../image-list/image-list.module';
import { FolderExplorerRoutingModule } from './folder-explorer.routing.module';
import { FoldersListModule } from '../folders-list/folders-list.module';
import { FolderBreadcrumbsModule } from '../folder-breadcrumbs/folder-breadcrumbs.module';

@NgModule({
    declarations: [FolderExplorerComponent],
    exports: [FolderExplorerComponent],
    imports: [FolderExplorerRoutingModule, ImageListModule, FoldersListModule, FolderBreadcrumbsModule],
})
export class FolderExplorerModule {}
