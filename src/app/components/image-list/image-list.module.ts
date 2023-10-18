import { NgModule } from '@angular/core';
import { ImageListComponent } from './image-list.component';
import { ServicesModule } from '../../services/services.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    ImageListComponent,
  ],
  bootstrap: [ImageListComponent],
  imports: [ServicesModule, RouterModule]
})
export class ImageListModule {}
