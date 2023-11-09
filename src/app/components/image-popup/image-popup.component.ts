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
  
  // @HostListener('document:click', ['$event'])
  // onClick(event: any): void {
  //   this.clickNotification.click();
  // }

  @ViewChild(ImageComponent, { read: ElementRef })
  imageComponent: ElementRef | undefined;
  
  public id$: Observable<string>;

  constructor(
    private route: ActivatedRoute,
    private clickNotification: ClickNotificationService,
    private el: ElementRef
  ) {
    this.id$ = this.route.paramMap.pipe(
      switchMap((x: ParamMap) => {
        if (x.has('id')) return of(x.get('id'));
        return EMPTY;
      }),
      filter((x): x is NonNullable<string> => !!x)
    );

    el.nativeElement.addEventListener(
      'click',
      (e: any) => {
        console.log(e);
        const path: [] = e.composedPath();
        const imgEl = path.find(x => x === this.imageComponent?.nativeElement);
        if (!imgEl) {
          this.clickNotification.click();
        }
      }
      ,{once: false}
    );
  }
}
