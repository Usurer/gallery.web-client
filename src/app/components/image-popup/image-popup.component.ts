import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { EMPTY, Observable, filter, of, switchMap } from 'rxjs';

@Component({
  selector: 'glr-image-popup',
  templateUrl: './image-popup.component.html',
  styleUrls: ['./image-popup.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class ImagePopupComponent {
  
  public id$: Observable<string>;

  constructor(
    private route: ActivatedRoute
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
