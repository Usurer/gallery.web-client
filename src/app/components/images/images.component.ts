import { Component } from '@angular/core';
import { ImagesStore } from '../../services/imagesStore';

@Component({
  selector: 'glr-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.scss'],
})
export class ImagesComponent {

  readonly images$ = this.imagesStore.select(state => state.images);

  constructor(
    private readonly imagesStore: ImagesStore
  ) { }

  OnButtonClick() {
    this.imagesStore.getImages();
  }
}
