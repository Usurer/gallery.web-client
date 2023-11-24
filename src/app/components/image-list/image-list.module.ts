import { NgModule } from '@angular/core';
import { ImageListComponent } from './image-list.component';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ImageListRoutingModule } from './image-list.routing.module';
import { ImagePopupModule } from '../image-popup/image-popup.module';
import { ImageListDumbComponent } from './image-list-dumb.component';
import { MatIconModule } from '@angular/material/icon';
import {ScrollingModule} from '@angular/cdk/scrolling';

@NgModule({
  declarations: [
    ImageListComponent,
    ImageListDumbComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule,
    ImagePopupModule,
    ImageListRoutingModule,MatIconModule, ScrollingModule
  ]
})
export class ImageListModule {}
