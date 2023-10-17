import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './components/app/app.component';
import { appRoutes } from './app.routes';
import { NxWelcomeComponent } from './nx-welcome.component';
import { ImagesComponent } from './components/images/images.component';
import { ImagesStore } from './services/imagesStore';

@NgModule({
  declarations: [AppComponent, NxWelcomeComponent, ImagesComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes, { initialNavigation: 'enabledBlocking' }),
  ],
  providers: [ImagesStore],
  bootstrap: [ImagesComponent],
})
export class AppModule {}
