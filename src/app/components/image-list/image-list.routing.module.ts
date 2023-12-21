import { Route, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ImageComponent } from '../image/image.component';
import { ImageListComponent } from './image-list.component';
import { ImagePopupComponent } from '../image-popup/image-popup.component';

const ROUTES: Route[] = [
    {
        path: 'imagelist',
        children: [
            {
                path: ':rootId',
                component: ImageListComponent,
                children: [{ path: ':id', component: ImagePopupComponent }],
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(ROUTES)],
    exports: [RouterModule],
})
export class ImageListRoutingModule {}
