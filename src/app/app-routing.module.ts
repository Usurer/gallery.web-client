import { Route, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { ImageComponent } from "./components/image/image.component";
import { ImageListComponent } from "./components/image-list/image-list.component";

const APP_ROUTES: Route[] = [
  { path: 'image/:id', component: ImageComponent },
  { path: 'imagelist', component: ImageListComponent },
  { path: '', redirectTo: 'imagelist', pathMatch: 'full' },
];

@NgModule({
    imports: [
      RouterModule.forRoot(
        APP_ROUTES,
        { enableTracing: true } // <-- debugging purposes only
      )
    ],
    exports: [
      RouterModule
    ]
  })
  export class AppRoutingModule {}