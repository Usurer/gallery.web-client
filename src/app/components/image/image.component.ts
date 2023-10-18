import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ImagesStore } from '../../services/imagesStore';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable, map, tap } from 'rxjs';

@Component({
  selector: 'glr-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageComponent implements OnInit {

constructor(
  private route: ActivatedRoute,
  private router: Router,) {
}

  id$: Observable<string> | null = null;

  query$: Observable<string> | null = null;

  ngOnInit() {
    this.id$ = this.route.paramMap.pipe(
      map((params: ParamMap) => {
        return params.get('id') ?? '';
      })
    );

    this.query$ = this.id$?.pipe(
      map(id => {
        return `http://localhost:5279/Images/GetImage?id=${id}`;
      }),
    );
  }
}
