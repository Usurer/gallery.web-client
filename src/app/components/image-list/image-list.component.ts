import {
    ChangeDetectionStrategy,
    Component,
    Input,
    ViewEncapsulation,
} from '@angular/core';
import { ItemInfo } from '../../dto/item-info';
import { ClickNotificationService } from '../../services/click-notification.service';
import { animate, style, transition, trigger } from '@angular/animations';

type RowInfo = {
    row: ItemInfo[];
    visible: boolean;
    rowHeight: number;
};

@Component({
    selector: 'glr-image-list',
    templateUrl: './image-list.component.html',
    styleUrls: ['./image-list.component.scss'],
    encapsulation: ViewEncapsulation.Emulated,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ClickNotificationService],
    animations: [
        trigger('myInsertRemoveTrigger', [
            transition(':enter', [style({ opacity: 0 }), animate('300ms', style({ opacity: 1 }))]),
            transition(':leave', [animate('100ms', style({ opacity: 0 }))]),
        ]),
    ],
})
export class ImageListComponent {
    @Input()
    rowsInfo: RowInfo[] = [];

    trackImage(idx: number, itemInfo: ItemInfo): string {
        return `${itemInfo.id}`;
    }

    trackRow(idx: number, rowInfo: RowInfo): string {
        return `${idx}_${rowInfo.rowHeight}_${rowInfo.visible}`;
    }
}
