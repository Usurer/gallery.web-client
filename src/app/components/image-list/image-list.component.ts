import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ImageListStore } from '../../services/image-list.store';
import { BehaviorSubject, Observable, Subject, filter, map, tap } from 'rxjs';
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

  take$ = new BehaviorSubject<number>(10);

  @ViewChild('takeInput') takeinput: ElementRef<HTMLInputElement> | undefined;

  readonly images$: Observable<ItemInfo[]> = this.imagesStore
    .select(state => state.images)
    .pipe(
      tap(x => console.log(x)),
      map(x => x.filter(k => k.name.toLowerCase().endsWith('jpg') || k.name.toLowerCase().endsWith('jpeg')))
    );

  constructor(
    private readonly imagesStore: ImageListStore,
    private readonly router: Router,    
  ) {
    router.events.pipe(
      filter(e => e instanceof RouterEvent)
    );
  }

  ngOnInit(): void {
    this.imagesStore.getImages(20);
  }

  OnButtonClick() {
    this.imagesStore.getImages(this.take$ ?? 10);
  }

  onTakeBlur(value: string): void {
    const val = parseInt(value);
    if (!Number.isNaN(val))
    {
      this.take$.next(val);
    } else {
      if (this.takeinput) {
        this.takeinput.nativeElement.value = this.take$.value + '';
      }
    }
    
  }
}
