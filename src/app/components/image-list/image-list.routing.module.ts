import { Route, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { ImageComponent } from "../image/image.component";
import { ImageListComponent } from "./image-list.component";

const ROUTES: Route[] = [
  { 
    path: 'imagelist',
    component: ImageListComponent,
    children: [
      { path: ':id', component: ImageComponent },
    ]
  },
];

@NgModule({
    imports: [
      RouterModule.forChild(
        ROUTES
      )
    ],
    exports: [
      RouterModule
    ]
  })
  export class ImageListRoutingModule {}