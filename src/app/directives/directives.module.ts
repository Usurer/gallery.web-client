import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotifyChangeDirective } from './notify-change.directive';



@NgModule({
  declarations: [
    NotifyChangeDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    NotifyChangeDirective
  ]
})
export class DirectivesModule { }
