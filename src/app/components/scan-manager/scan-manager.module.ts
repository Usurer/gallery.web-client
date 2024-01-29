import { NgModule } from '@angular/core';
import { ScanManagerComponent } from './scan-manager/scan-manager.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
    declarations: [ScanManagerComponent],
    imports: [CommonModule, HttpClientModule],
})
export class ScanManagerModule {}
