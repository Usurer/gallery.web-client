import { Directive, ElementRef, EventEmitter, Output } from '@angular/core';

@Directive({
  selector: '[glrNotifyChange]'
})
export class NotifyChangeDirective {

  @Output()
  completeEvent = new EventEmitter<boolean>;

  constructor(private el: ElementRef<HTMLImageElement>) {
    const img = el.nativeElement;
    const checkInterval = setInterval(() => {
      if(img.complete) {
        // console.log('complete');
        this.completeEvent.emit(true);
        clearInterval(checkInterval);
      }
    }, 100);

  }

}
