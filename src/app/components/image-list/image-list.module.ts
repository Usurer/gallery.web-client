import { NgModule } from '@angular/core';
import { ImageListComponent } from './image-list.component';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ImageListRoutingModule } from './image-list.routing.module';
import { ImagePopupModule } from '../image-popup/image-popup.module';

@NgModule({
  declarations: [
    ImageListComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule,
    ImagePopupModule,
    ImageListRoutingModule
  ]
})
export class ImageListModule {}
