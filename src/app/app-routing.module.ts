import { Route, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { ImageListModule } from "./components/image-list/image-list.module";
import { ImageComponent } from "./components/image/image.component";
import { ImageListComponent } from "./components/image-list/image-list.component";

const APP_ROUTES: Route[] = [
  { path: 'imagelist', component: ImageListComponent },
  { path: 'image/:id', component: ImageComponent },
  { path: '', redirectTo: 'imagelist', pathMatch: 'full' },
];

@NgModule({
    imports: [
      RouterModule.forRoot(
        APP_ROUTES,
        { enableTracing: false } // <-- debugging purposes only
      ),
      ImageListModule
    ],
    exports: [
      RouterModule
    ]
  })
  export class AppRoutingModule {}