import {
  AfterViewInit,
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
export class ImageListComponent implements OnInit, OnDestroy, AfterViewInit {

  private topPosition$ = new BehaviorSubject<number>(0);
  private resizeObserver?: ResizeObserver;

  overlayClickSubscription: Subscription | undefined;

  take$ = new BehaviorSubject<number>(990);

  resizeSubject$ = new BehaviorSubject<number>(500);

  @ViewChild('takeInput')
  takeinput?: ElementRef<HTMLInputElement>;

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
      return this.setRowsVisibility(scrollTop, rows);
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
    private viewContainerRef: ViewContainerRef,
    clickNotification: ClickNotificationService,
  ) {
    this.overlayClickSubscription = clickNotification.clicks.subscribe({
      next: (value) => this.router.navigate(['../'])
    });
  }

  ngOnDestroy(): void {
    this.overlayClickSubscription?.unsubscribe();
    this.resizeObserver?.disconnect();
  }

  ngOnInit(): void {
    this.rowsVisibility$.subscribe();

    this.imagesStore.getImages(this.take$ ?? 10);
  }

  ngAfterViewInit() {
    this.attachResizeObserver();
  }

  private attachResizeObserver() {
    this.resizeObserver = new ResizeObserver((entries) => {
      const first = entries[0];
      this.zone.run(() => {
        const width = first.contentRect.width;
        this.resizeSubject$.next(width - 15);
      });
    });
    
    const wrapperEl = this.viewContainerRef.element.nativeElement;
    this.resizeObserver.observe(wrapperEl);
  }

  private setRowsVisibility(scrollTop: number, rows: ItemInfo[][]): RowInfo[] {
    const result = [];
    const rowHeight = (rows[0][0].height ?? 0) + 4;
    
    const wrapperEl = this.viewContainerRef.element.nativeElement;
    const wrapperHeight = wrapperEl.clientHeight ?? wrapperEl.getBoundingClientRect().height;
    const rowsInView = Math.ceil(wrapperHeight / rowHeight);

    const visibilityStartIdx = Math.floor(scrollTop / rowHeight) - rowsInView;
    const visibilityEndIdx = visibilityStartIdx + rowsInView * 2;

    for(let i = 0; i < rows.length; i++) {
      
      const rowInfo: RowInfo = {
        row: rows[i],
        visible: i >= visibilityStartIdx && i <= visibilityEndIdx,
        rowHeight: rowHeight
      }
      result.push(rowInfo);
    }

    return result;
  }

  trackImage(idx: number, itemInfo: ItemInfo): string {
    return `${itemInfo.id}`;
  }

  trackRow(idx: number, rowInfo: RowInfo): string {
    return `${idx}_${rowInfo.rowHeight}_${rowInfo.visible}`;
  }
}
