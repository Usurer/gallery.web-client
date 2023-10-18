import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ImageListModule } from './components/image-list/image-list.module';
import { ImageListComponent } from './components/image-list/image-list.component';
import { ImageComponent } from './components/image/image.component';
import { PlaceholderComponent } from './components/placeholder/placeholder.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [ImageComponent, PlaceholderComponent],
  imports: [
    BrowserModule,    
    ImageListModule,
    AppRoutingModule
  ],
  bootstrap: [ImageListComponent],
})
export class AppModule {}
