import { Component } from '@angular/core';
import { ImagesStore } from '../../services/imagesStore';

@Component({
  selector: 'glr-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
})
export class ImageComponent {

  readonly images$ = this.imagesStore.select(state => state.images);

  constructor(
    private readonly imagesStore: ImagesStore
  ) { }

  OnButtonClick() {
    this.imagesStore.getImages();
  }
}
