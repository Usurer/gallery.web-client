import { RouterModule } from "@angular/router";
import { appRoutes } from "./app.routes";
import { NgModule } from "@angular/core";

@NgModule({
    imports: [
      RouterModule.forRoot(
        appRoutes,
        { enableTracing: true } // <-- debugging purposes only
      )
    ],
    exports: [
      RouterModule
    ]
  })
  export class AppRoutingModule {}