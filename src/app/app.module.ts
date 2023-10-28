import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ImageListModule } from './components/image-list/image-list.module';
import { ImageComponent } from './components/image/image.component';
import { PlaceholderComponent } from './components/placeholder/placeholder.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    ImageComponent, 
    PlaceholderComponent, 
    AppComponent
  ],
  imports: [
    CommonModule,
    BrowserModule, 
    ImageListModule, 
    AppRoutingModule
  ],
  bootstrap: [
    AppComponent
  ],
})
export class AppModule {}
