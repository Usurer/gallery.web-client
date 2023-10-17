import { Component } from '@angular/core';
import { ImagesStore } from 'src/app/services/imagesStore';

@Component({
  selector: 'app-images',
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
