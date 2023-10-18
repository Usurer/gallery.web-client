import { NgModule } from '@angular/core';
import { ImageListComponent } from './image-list.component';
import { ServicesModule } from '../../services/services.module';

@NgModule({
  declarations: [
    ImageListComponent,
  ],
  bootstrap: [ImageListComponent],
  imports: [ServicesModule]
})
export class ImageListModule {}
