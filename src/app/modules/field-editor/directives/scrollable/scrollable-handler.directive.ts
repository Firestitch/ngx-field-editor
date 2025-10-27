import { Directive, ElementRef, OnInit } from '@angular/core';
import { CdkScrollable } from "@angular/cdk/scrolling";

/**
 * This directive is a dirty hack & black magin in one bottle
 *
 * This should fix task SP-T2685 when user starts dragging and do scroll at the same time
 * it should recalculate positions of all elements
 */
@Directive({
    selector: '[scrollableHandler]',
    standalone: true,
})
export class ScrollableHandlerDirective extends CdkScrollable implements OnInit {

  public ngOnInit() {
    const scrollableElement = this._getScrollableElement();
    if (scrollableElement) {
      this.elementRef = scrollableElement;
      super.ngOnInit();
    }
  }

  private _getScrollableElement(): ElementRef | null {
    let parent = this.elementRef.nativeElement.parentElement;
    while (parent) {
      if (parent.nodeName === 'MAT-DIALOG-CONTENT') {
        return new ElementRef(parent);
      }

      parent = parent.parentElement;
    }

    return null;
  }
}
