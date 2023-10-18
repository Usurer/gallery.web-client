import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { appRoutes } from './app.routes';
import { ImageListModule } from './components/image-list/image-list.module';
import { ImageListComponent } from './components/image-list/image-list.component';
import { ImageComponent } from './components/image/image.component';
import { PlaceholderComponent } from './components/placeholder/placeholder.component';

@NgModule({
  declarations: [ImageComponent, PlaceholderComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes, { initialNavigation: 'enabledBlocking' }),
    ImageListModule,
  ],
  bootstrap: [ImageListComponent],
})
export class AppModule {}
