import { Component, ElementRef, HostListener, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { EMPTY, Observable, filter, of, switchMap } from 'rxjs';
import { ClickNotificationService } from '../../services/click-notification.service';
import { ImageComponent } from '../image/image.component';

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
  
  public id$: Observable<string>;

  constructor(
    private route: ActivatedRoute,
    private clickNotification: ClickNotificationService,
  ) {
    this.id$ = this.route.paramMap.pipe(
      switchMap((x: ParamMap) => {
        if (x.has('id')) return of(x.get('id'));
        return EMPTY;
      }),
      filter((x): x is NonNullable<string> => !!x)
    );
  }
}
