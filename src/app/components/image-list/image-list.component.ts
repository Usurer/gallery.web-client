import {
  ChangeDetectionStrategy,
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
import { BehaviorSubject, Observable, Subscription, combineLatest, debounceTime, distinctUntilChanged, filter, first, map, startWith, switchMap, tap, withLatestFrom } from 'rxjs';
import { ItemInfo } from '../../dto/item-info';
import { Router } from '@angular/router';
import { ClickNotificationService } from '../../services/click-notification.service';
import { GalleryLayoutService } from '../../services/gallery-layout.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

type RowInfo = {
  row: ItemInfo[],
  visible: boolean,
  rowHeight: number
}

@Component({
  selector: 'glr-image-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ClickNotificationService],
  animations: [
    trigger('myInsertRemoveTrigger', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('100ms', style({ opacity: 0 }))
      ])
    ]),
  ]
})
export class ImageListComponent implements OnInit, OnDestroy {

  private topPosition$ = new BehaviorSubject<number>(0);

  overlayClickSubscription: Subscription | undefined;

  take$ = new BehaviorSubject<number>(990);

  resizeSubject$ = new BehaviorSubject<number>(500);

  @ViewChild('takeInput')
  takeinput: ElementRef<HTMLInputElement> | undefined;

  @ViewChildren("rowsWrapper")
  rowsWrapper: QueryList<ElementRef> | undefined;

  @HostListener('scroll', ['$event.target'])
  handleScroll(element: HTMLElement): void {
    this.topPosition$.next(element.scrollTop);
  }

  readonly images$: Observable<ItemInfo[]> = this.imagesStore
    .select(state => state.images)
    .pipe(
      map(x => x.filter(k => k.name.toLowerCase().endsWith('jpg') || k.name.toLowerCase().endsWith('jpeg'))),
      filter(x => x.length > 0)
    );

  readonly resizeNotificator$ = this.resizeSubject$.pipe(
    debounceTime(100),
    distinctUntilChanged()
  );
  
  readonly rows$: Observable<ItemInfo[][]> = this.resizeNotificator$.pipe(
    switchMap(size => this.images$.pipe(    
      map((images) => this.galleryLayout.defineRows(images, size)),
    )),
  );

  readonly rowsVisibility$: Observable<RowInfo[]> = combineLatest([this.topPosition$.pipe(debounceTime(200)), this.rows$]).pipe(
    map(([scrollTop, rows]) => {
      const result = [];
      const rowHeight = (rows[0][0].height ?? 0) + 4;
      
      const wrapperEl = this.viewContainerRef.element.nativeElement;
      const wrapperHeight = wrapperEl.clientHeight ?? wrapperEl.getBoundingClientRect().height;
      const rowsInView = Math.ceil(wrapperHeight / rowHeight);

      const visibilityStartIdx = Math.floor(scrollTop / rowHeight) - rowsInView;
      const visibilityEndIdx = visibilityStartIdx + rowsInView * 2;


      console.log(`Visibility idx is ${visibilityStartIdx}`);

      for(let i = 0; i < rows.length; i++) {
        
        const rowInfo: RowInfo = {
          row: rows[i],
          visible: i >= visibilityStartIdx && i <= visibilityEndIdx,
          rowHeight: rowHeight
        }
        result.push(rowInfo);
      }

      return result;
    }),
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
    this.attachResizeObserver();    

    this.rowsVisibility$.subscribe();
  }

  private attachResizeObserver() {
    this.rows$.pipe(
      filter(x => x.length > 0),
      first()
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
