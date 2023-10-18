import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './components/app/app.component';
import { appRoutes } from './app.routes';
import { NxWelcomeComponent } from './nx-welcome.component';
import { ImagesComponent } from './components/images/images.component';
import { ImageListModule } from './components/image-list/image-list.module';
import { ImageListComponent } from './components/image-list/image-list.component';

@NgModule({
  declarations: [
    AppComponent,
    NxWelcomeComponent,
    ImagesComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes, { initialNavigation: 'enabledBlocking' }),
    ImageListModule
  ],
  bootstrap: [ImageListComponent],
})
export class AppModule {}
