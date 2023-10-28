import { NgModule } from '@angular/core';
import { ImageListComponent } from './image-list.component';
import { ServicesModule } from '../../services/services.module';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    ImageListComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    ServicesModule, 
    RouterModule
  ]
})
export class ImageListModule {}
