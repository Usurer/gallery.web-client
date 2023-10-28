import { NgModule } from '@angular/core';
import { ImageListComponent } from './image-list.component';
import { ServicesModule } from '../../services/services.module';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ImageListRoutingModule } from './image-list.routing.module';

@NgModule({
  declarations: [
    ImageListComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    ServicesModule, 
    RouterModule,
    ImageListRoutingModule
  ]
})
export class ImageListModule {}
