import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ImageListModule } from './components/image-list/image-list.module';
import { ImageComponent } from './components/image/image.component';
import { PlaceholderComponent } from './components/placeholder/placeholder.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ImageModule } from './components/image/image.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    PlaceholderComponent, 
    AppComponent
  ],
  imports: [
    CommonModule,
    BrowserModule, 
    HttpClientModule,
    ImageModule,
    ImageListModule, 
    AppRoutingModule
  ],
  bootstrap: [
    AppComponent
  ],
})
export class AppModule {
  // Diagnostic only: inspect router configuration
  constructor(router: Router) {
    // Use a custom replacer to display function names in the route configs
    const replacer = (key: any, value: any) => (typeof value === 'function') ? value.name : value;

    console.log('Routes: ', JSON.stringify(router.config, replacer, 2));
  }
}
