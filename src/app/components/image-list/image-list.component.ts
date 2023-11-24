import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  NgZone,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { ImageListStore } from '../../services/image-list.store';
import { BehaviorSubject, Observable, Subject, Subscription, combineLatest, debounce, debounceTime, distinct, distinctUntilChanged, filter, first, map, mergeMap, of, startWith, switchMap, tap } from 'rxjs';
import { ItemInfo } from '../../dto/item-info';
import { Router, RouterEvent } from '@angular/router';
import { ClickNotificationService } from '../../services/click-notification.service';
import { GalleryLayoutService } from '../../services/gallery-layout.service';

@Component({
  selector: 'glr-image-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ClickNotificationService]
})
export class ImageListComponent implements OnInit, OnDestroy {

  messages = [1, 2, 3, 4, 5];

  overlayClickSubscription: Subscription | undefined;

  take$ = new BehaviorSubject<number>(990);

  resizeSubject$ = new BehaviorSubject<number>(500);

  @ViewChild('takeInput')
  takeinput: ElementRef<HTMLInputElement> | undefined;

  @ViewChildren("rowsWrapper")
  rowsWrapper: QueryList<ElementRef> | undefined;

  readonly images$: Observable<ItemInfo[]> = this.imagesStore
    .select(state => state.images)
    .pipe(
      map(x => x.filter(k => k.name.toLowerCase().endsWith('jpg') || k.name.toLowerCase().endsWith('jpeg'))),
      filter(x => x.length > 0)
    );

  readonly rows$: Observable<ItemInfo[][]> = this.resizeSubject$.pipe(
    debounceTime(100),
    distinctUntilChanged(),
    switchMap(size => this.images$.pipe(    
      map((images) => this.galleryLayout.defineRows(images, size)),
    )),
  );

  readonly hasRows$ = this.rows$.pipe(
    map(x => x && x.length > 0), 
    startWith(false)
  );

  constructor(
    private readonly imagesStore: ImageListStore,
    private galleryLayout: GalleryLayoutService,
    private zone: NgZone,
    private readonly router: Router,
    private clickNotification: ClickNotificationService,
    private viewContainerRef: ViewContainerRef
  ) {
    this.overlayClickSubscription = clickNotification.clicks.subscribe({
      next: (value) => this.router.navigate(['../'])
    });
  }

  ngOnDestroy(): void {
    this.overlayClickSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.rows$.pipe(
      filter(x => x.length > 0),
      first(),
    ).subscribe({
      next: () => {
        this.rowsWrapper?.changes.pipe(
          tap(() => {
            const wrapperEl = this.viewContainerRef.element.nativeElement;
            const resizeObserver = new ResizeObserver(el => {
              this.zone.run(() => {
                const width = wrapperEl.clientWidth ?? wrapperEl.getBoundingClientRect().width;
                this.resizeSubject$.next(width - 15);
              });
            });
            resizeObserver.observe(wrapperEl);
          }),
          first()
        ).subscribe(); 
      }
    });
  }

  onTakePageClick() {
    this.imagesStore.getImages(this.take$ ?? 10);
  }

  onRepeatClick() {
    this.imagesStore.repeatGetImages(this.take$ ?? 10);
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
