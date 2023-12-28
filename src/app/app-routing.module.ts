import { Route, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ImageListModule } from './components/image-list/image-list.module';
import { ImageComponent } from './components/image/image.component';
import { ImageListComponent } from './components/image-list/image-list/image-list.component';
import { FOLDER_ROUTE, IMAGE_ROUTE } from './app-routes';

const APP_ROUTES: Route[] = [
    { path: FOLDER_ROUTE, component: ImageListComponent },
    { path: `${IMAGE_ROUTE}/:id`, component: ImageComponent },
    { path: '', redirectTo: FOLDER_ROUTE, pathMatch: 'full' },
];

@NgModule({
    imports: [
        RouterModule.forRoot(
            APP_ROUTES,
            { enableTracing: true, bindToComponentInputs: true } // <-- debugging purposes only
        ),
        ImageListModule,
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
