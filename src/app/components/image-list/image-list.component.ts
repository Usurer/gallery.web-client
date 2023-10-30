import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { ImageListStore } from '../../services/image-list.store';
import { Observable, filter, map, tap } from 'rxjs';
import { ItemInfo } from '../../dto/item-info';
import { Router, RouterEvent } from '@angular/router';

@Component({
  selector: 'glr-image-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageListComponent implements OnInit {
  readonly images$: Observable<ItemInfo[]> = this.imagesStore
    .select(state => state.images)
    .pipe(
      tap(x => console.log(x)),
      map(x => x.filter(k => k.name.endsWith('jpg') || k.name.endsWith('jpeg')))
    );

  constructor(
    private readonly imagesStore: ImageListStore,
    private readonly router: Router
  ) {
    router.events.pipe(
      filter(e => e instanceof RouterEvent)
    );
  }

  ngOnInit(): void {
    this.imagesStore.getImages(20);
  }

  OnButtonClick() {
    this.imagesStore.getImages(50);
  }
}
