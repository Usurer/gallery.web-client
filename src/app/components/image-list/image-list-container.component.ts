import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    HostListener,
    Input,
    NgZone,
    OnDestroy,
    OnInit,
    ViewContainerRef,
    ViewEncapsulation,
} from '@angular/core';
import { ImageListStore } from './image-list.store';
import {
    BehaviorSubject,
    Observable,
    Subscription,
    combineLatest,
    debounceTime,
    distinctUntilChanged,
    filter,
    map,
    switchMap,
} from 'rxjs';
import { ItemInfo } from '../../dto/item-info';
import { ActivatedRoute, Router } from '@angular/router';
import { ClickNotificationService } from '../../services/click-notification.service';

export type RowInfo = {
    row: ItemInfo[];
    visible: boolean;
    rowHeight: number;
};

@Component({
    selector: 'glr-image-list-container',
    templateUrl: './image-list-container.component.html',
    styleUrls: ['./image-list-container.component.scss'],
    encapsulation: ViewEncapsulation.Emulated,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ClickNotificationService, ImageListStore],
})
export class ImageListContainerComponent implements OnInit, OnDestroy, AfterViewInit {
    private topPosition$ = new BehaviorSubject<number>(0);

    private resizeObserver?: ResizeObserver;
    private resizeSubject$ = new BehaviorSubject<number>(500);
    readonly resizeNotificator$ = this.resizeSubject$.pipe(debounceTime(100), distinctUntilChanged());

    private overlayClickSubscription?: Subscription;

    readonly images$: Observable<ItemInfo[]> = this.imagesStore
        .select((state) => state.images)
        .pipe(filter((x) => x.length > 0));

    readonly itemsAsRows$: Observable<ItemInfo[][]> = this.imagesStore.resizeRows(this.resizeNotificator$);

    readonly rowsInfo$: Observable<RowInfo[]> = combineLatest([
        this.topPosition$.pipe(debounceTime(200)),
        this.itemsAsRows$,
    ]).pipe(
        map(([scrollTop, rows]) => {
            return this.setRowsVisibility(scrollTop, rows);
        })
    );

    @HostListener('scroll', ['$event.target'])
    handleScroll(element: HTMLElement): void {
        this.topPosition$.next(element.scrollTop);
    }

    @Input()
    rootId!: number;

    constructor(
        private readonly imagesStore: ImageListStore,
        private readonly zone: NgZone,
        private readonly router: Router,
        private readonly route: ActivatedRoute,
        private readonly viewContainerRef: ViewContainerRef,
        clickNotification: ClickNotificationService
    ) {
        this.overlayClickSubscription = clickNotification.clicks.subscribe({
            next: () => this.router.navigate(['./'], { relativeTo: this.route }),
        });
    }

    ngOnDestroy(): void {
        this.overlayClickSubscription?.unsubscribe();
        this.resizeObserver?.disconnect();
    }

    ngOnInit(): void {
        this.imagesStore.fetchImages({
            parentId: this.rootId,
            take: 1000,
            skip: 0,
        });
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

        const numberOfScrolledRows = Math.floor(scrollTop / rowHeight);

        const visibilityStartIdx = numberOfScrolledRows - rowsInView * 2;
        const visibilityEndIdx = numberOfScrolledRows + rowsInView * 2;

        for (let i = 0; i < rows.length; i++) {
            const rowInfo: RowInfo = {
                row: rows[i],
                visible: i >= visibilityStartIdx && i <= visibilityEndIdx,
                rowHeight: rowHeight,
            };
            result.push(rowInfo);
        }

        return result;
    }
}
