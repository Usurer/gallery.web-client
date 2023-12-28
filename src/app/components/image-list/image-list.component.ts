import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { ItemInfo } from '../../dto/item-info';
import { animate, style, transition, trigger } from '@angular/animations';
import { RowInfo } from './row-info';

@Component({
    selector: 'glr-image-list',
    templateUrl: './image-list.component.html',
    styleUrls: ['./image-list.component.scss'],
    encapsulation: ViewEncapsulation.Emulated,
    changeDetection: ChangeDetectionStrategy.OnPush,
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

    trackImage(_: number, itemInfo: ItemInfo): string {
        return `${itemInfo.id}`;
    }

    trackRow(idx: number, rowInfo: RowInfo): string {
        return `${idx}_${rowInfo.rowHeight}_${rowInfo.visible}`;
    }
}
