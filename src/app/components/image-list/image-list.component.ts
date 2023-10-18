import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { ImagesStore } from '../../services/imagesStore';

@Component({
  selector: 'glr-image-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageListComponent {
  readonly images$ = this.imagesStore.select(state => state.images);

  constructor(
    private readonly imagesStore: ImagesStore
  ) { }

  OnButtonClick() {
    this.imagesStore.getImages();
  }
}
