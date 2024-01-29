import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'glr-scan-manager',
    templateUrl: './scan-manager.component.html',
    styleUrls: ['./scan-manager.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScanManagerComponent {}
