import { Component, ElementRef, HostListener, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { EMPTY, Observable, filter, of, switchMap } from 'rxjs';
import { ClickNotificationService } from '../../services/click-notification.service';
import { ImageComponent } from '../image/image.component';
import { HttpClient } from '@angular/common/http';
import { ItemInfo } from '../../dto/item-info';

@Component({
  selector: 'glr-image-popup',
  templateUrl: './image-popup.component.html',
  styleUrls: ['./image-popup.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class ImagePopupComponent {
  
  @HostListener('click', ['$event'])
  onClick(event: Event): void {
    const path = event.composedPath();
    const clickedOutsideOfImage = path.findIndex(x => x === this.imageComponent?.nativeElement) < 0;
    if (clickedOutsideOfImage) {
      this.clickNotification.click();
    }
  }

  @ViewChild(ImageComponent, { read: ElementRef })
  imageComponent: ElementRef | undefined;
  
  public itemInfo$: Observable<ItemInfo>;

  constructor(
    private route: ActivatedRoute,
    private clickNotification: ClickNotificationService,
    private http: HttpClient
  ) {
    this.itemInfo$ = this.route.paramMap.pipe(
      switchMap((x: ParamMap) => {
        if (x.has('id')) {
          const id = x.get('id');
          return this.http.get<ItemInfo>('http://localhost:5279/api/Meta/GetItemMetadata?id=' + id);
        }
        
        return EMPTY;
      }),
      filter((x): x is NonNullable<ItemInfo> => !!x)
    );
  }
}
