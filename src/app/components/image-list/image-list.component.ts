import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { ImageListStore } from '../../services/image-list.store';
import { Observable, tap } from 'rxjs';
import { ItemInfo } from '../../dto/item-info';

@Component({
  selector: 'glr-image-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageListComponent {
  readonly images$: Observable<ItemInfo[]> = this.imagesStore
    .select(state => state.images)
    .pipe(tap(x => console.log(x)));

  constructor(
    private readonly imagesStore: ImageListStore
  ) { }

  OnButtonClick() {
    this.imagesStore.getImages(10);
  }
}
