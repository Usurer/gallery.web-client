import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { Observable } from 'rxjs';
import { ItemInfo } from '../../dto/item-info';
import { ClickNotificationService } from '../../services/click-notification.service';

@Component({
  selector: 'glr-image-list-dumb',
  templateUrl: './image-list-dumb.component.html',
  styleUrls: ['./image-list-dumb.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ClickNotificationService]
})
export class ImageListDumbComponent{

  @Input()
  rows$: Observable<ItemInfo[][]> | undefined;

}
