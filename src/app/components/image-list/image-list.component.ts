import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ImageListStore } from '../../services/image-list.store';
import { BehaviorSubject, Observable, Subject, Subscription, combineLatest, distinct, distinctUntilChanged, filter, first, map, mergeMap, tap } from 'rxjs';
import { ItemInfo } from '../../dto/item-info';
import { Router, RouterEvent } from '@angular/router';
import { ClickNotificationService } from '../../services/click-notification.service';
import { GalleryLayoutService } from '../../services/gallery-layout.service';

@Component({
  selector: 'glr-image-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ClickNotificationService]
})
export class ImageListComponent implements OnInit, OnDestroy {

  overlayClickSubscription: Subscription | undefined;

  take$ = new BehaviorSubject<number>(2);

  resizeSubject$ = new BehaviorSubject<number>(500);

  @ViewChild('takeInput')
  takeinput: ElementRef<HTMLInputElement> | undefined;

  @ViewChild("rowsWrapper")
  rowsWrapper: ElementRef | undefined;

  @HostListener('window:resize', ['$event'])
  resized(e: any): void {
    // console.log(e);
    const w = this.rowsWrapper?.nativeElement.clientWidth;
    this.resizeSubject$.next(w);
  }

  readonly images$: Observable<ItemInfo[]> = this.imagesStore
    .select(state => state.images)
    .pipe(
      // tap(x => console.log(x)),
      map(x => x.filter(k => k.name.toLowerCase().endsWith('jpg') || k.name.toLowerCase().endsWith('jpeg')))      
    );

  readonly rowsSource$ = this.images$.pipe(
    filter(x => x.length > 0)
  );

  readonly rows$: Observable<ItemInfo[][]> =  this.resizeSubject$.pipe(
    // tap(x => console.log(`resized to ${x}`)),
    distinctUntilChanged(),
    tap(x => console.log(`distict to ${x}`)),
    mergeMap(size => this.rowsSource$.pipe(      
      // tap(() => setTimeout(() => this.cd.detectChanges(), 1)),
      map((rows) => this.galleryLayout.defineRows(rows, size)),
    ))
  );

  constructor(
    private readonly imagesStore: ImageListStore,
    private readonly router: Router,
    private clickNotification: ClickNotificationService,
    private galleryLayout: GalleryLayoutService,
    private cd: ChangeDetectorRef
  ) {
    router.events.pipe(
      filter(e => e instanceof RouterEvent)
    );
    
    this.overlayClickSubscription = clickNotification.clicks.subscribe({
      next: (value) => this.router.navigate(['../'])
    });
  }
  ngOnDestroy(): void {
    this.overlayClickSubscription?.unsubscribe();
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    // this.imagesStore.getImages(1);

    // this.rows$.pipe(
    //   filter(x => x.length > 0),
    //   first()      
    // ).subscribe({
    //   next: () => {
    //     setTimeout(() => {
    //       const wrapperEl = this.rowsWrapper?.nativeElement;
    //       const obs = new ResizeObserver(el => {
    //         const width = el[0]?.target?.clientWidth;
    //         this.resizeSubject$.next(width);
    //         // console.log('resized');
    //       });
    //       obs.observe(wrapperEl);
    //     }, 10);
    //   }
    // });
  }

  onTakePageClick() {
    this.imagesStore.getImages(this.take$ ?? 10);
  }

  onRepeatClick() {
    //this.imagesStore.repeatGetImages(this.take$ ?? 10);
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

  onResizeClick(): void {
    if (this.resizeSubject$.value < 500) {
      this.resizeSubject$.next(500);
    } else {
      this.resizeSubject$.next(300);
    }
  }

  trackByImgId(idx: number, item: ItemInfo): string {
    return ' ' + item.id + item.width!;
  }
}
