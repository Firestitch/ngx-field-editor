import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Directive, ElementRef, EventEmitter, HostBinding, HostListener, Input, isDevMode, OnDestroy, OnInit, Output, PLATFORM_ID, inject } from '@angular/core';

import { animationFrameScheduler, BehaviorSubject, combineLatest, Observable, pipe, Subject } from 'rxjs';
import { auditTime, filter, map, share, startWith, takeUntil, throttleTime } from 'rxjs/operators';


export interface StickyPositions {
  offsetY: number;
  bottomBoundary: number | null;
  upperScreenEdgeAt?: number;
  marginTop?: number;
  marginBottom?: number;
}

export interface StickyStatus {
  isSticky: boolean;
  reachedUpperEdge: boolean;
  reachedLowerEdge: boolean;
  marginTop?: number;
  marginBottom?: number;
}

@Directive({
    selector: '[stickyThing]',
    standalone: true,
})
export class StickyThingDirective implements OnInit, AfterViewInit, OnDestroy {
  private _stickyElement = inject(ElementRef);
  private _platformId = inject(PLATFORM_ID);


  public filterGate = false;
  public marginTop$ = new BehaviorSubject(0);
  public marginBottom$ = new BehaviorSubject(0);
  public enable$ = new BehaviorSubject(true);

  @Input() public scrollContainer: string | HTMLElement | undefined;
  @Input() public auditTime = 0;
  @Input() public set marginTop(value: number) {
    this.marginTop$.next(value);
  }

  @Input() public set marginBottom(value: number) {
    this.marginBottom$.next(value);
  }

  @Input() public set enable(value: boolean) {
    this.enable$.next(value);
  }
  @Input('spacer') public spacerElement: HTMLElement | undefined;
  @Input('boundary') public boundaryElement: HTMLElement | undefined;
  public sticky = false;

  @HostBinding('class.is-sticky') public isSticky = false;
  @HostBinding('class.boundary-reached') public boundaryReached = false;
  @HostBinding('class.upper-bound-reached') public upperBoundReached = false;
  @Output() public stickyStatus: EventEmitter<StickyStatus> = new EventEmitter<StickyStatus>();
  @Output() public stickyPosition: EventEmitter<StickyPositions> = new EventEmitter<StickyPositions>();

  /**
   * The field represents some position values in normal (not sticky) mode.
   * If the browser size or the content of the page changes, this value must be recalculated.
   * */
  private _scroll$ = new Subject<number>();
  private _scrollThrottled$: Observable<number>;
  private _target;

  private _resize$ = new Subject<void>();
  private _resizeThrottled$: Observable<void>;
  private _extraordinaryChange$ = new BehaviorSubject<void>(undefined);

  private _status$: Observable<StickyStatus>;

  private _componentDestroyed = new Subject<void>();

  constructor() {

    /**
     * Throttle the scroll to animation frame (around 16.67ms) */
    this._scrollThrottled$ = this._scroll$
      .pipe(
        throttleTime(0, animationFrameScheduler),
        share(),
      );

    /**
     * Throttle the resize to animation frame (around 16.67ms) */
    this._resizeThrottled$ = this._resize$
      .pipe(
        throttleTime(0, animationFrameScheduler),
        // emit once since we are currently using combineLatest
        startWith(null),
        share(),
      );


    this._status$ = combineLatest(
      this.enable$,
      this._scrollThrottled$,
      this.marginTop$,
      this.marginBottom$,
      this._extraordinaryChange$,
      this._resizeThrottled$,
    )
      .pipe(
        filter(([enabled]) => this.checkEnabled(enabled)),
        map(([enabled, pageYOffset, marginTop, marginBottom]) => this._determineStatus(this._determineElementOffsets(), pageYOffset, marginTop, marginBottom, enabled)),
        share(),
      );

  }

  public ngAfterViewInit(): void {
    const operators = this.scrollContainer ?
      pipe(takeUntil(this._componentDestroyed)) :
      pipe(auditTime(this.auditTime), takeUntil(this._componentDestroyed));
    this._status$
      .pipe(operators)
      .subscribe((status: StickyStatus) => {
        this._setSticky(status);
        this._setStatus(status);
      });
  }

  public recalculate(): void {
    if (isPlatformBrowser(this._platformId)) {
      // Make sure to be in the next tick by using timeout
      setTimeout(() => {
        this._extraordinaryChange$.next(undefined);
      }, 0);
    }
  }


  /**
   * This is nasty code that should be refactored at some point.
   *
   * The Problem is, we filter for enabled. So that the code doesn't run
   * if @Input enabled = false. But if the user disables, we need exactly 1
   * emit in order to reset and call removeSticky. So this method basically
   * turns the filter in "filter, but let the first pass".
   * */
  public checkEnabled(enabled: boolean): boolean {

    if (!isPlatformBrowser(this._platformId)) {
      return false;
    }

    if (enabled) {
      // reset the gate
      this.filterGate = false;

      return true;
    } 
    if (this.filterGate) {
      // gate closed, first emit has happened
      return false;
    } 
    // this is the first emit for enabled = false,
    // let it pass, and activate the gate
    // so the next wont pass.
    this.filterGate = true;

    return true;


  }

  @HostListener('window:resize', [])
  public onWindowResize(): void {
    if (isPlatformBrowser(this._platformId)) {
      this._resize$.next();
    }
  }
 
  public getComputedStyle(el: HTMLElement): ClientRect | DOMRect {
    return el.getBoundingClientRect();
  }

  public setupListener(): void {
    if (isPlatformBrowser(this._platformId)) {
      const target = this._getScrollTarget();
      target.addEventListener('scroll', this.listener);
    }
  }

  public listener = (e: Event) => {
    const upperScreenEdgeAt = (e.target as HTMLElement).scrollTop || window.pageYOffset;
    this._scroll$.next(upperScreenEdgeAt);
  };


  public ngOnInit(): void {
    this._target = this._getScrollTarget();
    this._checkSetup();
    this.setupListener();
  }

  public ngOnDestroy(): void {
    this._target.removeEventListener('scroll', this.listener);
    this._componentDestroyed.next();
  }

  private _getScrollTarget(): Element | Window {
    let target: Element | Window;
    if (this.scrollContainer && typeof this.scrollContainer === 'string') {
      target = document.querySelector(this.scrollContainer);
      this.marginTop$.next(Infinity);
      this.auditTime = 0;
    } else if (this.scrollContainer && this.scrollContainer instanceof HTMLElement) {
      target = this.scrollContainer;
      this.marginTop$.next(Infinity);
      this.auditTime = 0;
    } else {
      target = window;
    }

    return target;
  }

  private get _scrollTop() {
    return (this._target).scrollTop || window.pageYOffset;
  } 

  private _determineStatus(originalVals: StickyPositions, pageYOffset: number, marginTop: number, marginBottom: number, enabled: boolean) {
    const elementPos = this._determineElementOffsets();
    let isSticky = enabled && pageYOffset > originalVals.offsetY;
    if (pageYOffset < elementPos.offsetY) {
      isSticky = false;
    }
    const stickyElementHeight = this.getComputedStyle(this._stickyElement.nativeElement).height;
    const reachedLowerEdge = this.boundaryElement  ? 
      this.boundaryElement && this._scrollTop + stickyElementHeight + marginBottom >= (originalVals.bottomBoundary - marginTop * 1.0) : undefined;
    
    const reachedUpperEdge = this.boundaryElement  ? 
      this._scrollTop < (this.boundaryElement.offsetTop + marginTop * 1.0) : undefined;
    this.stickyPosition.emit({ ...elementPos, upperScreenEdgeAt: pageYOffset, marginBottom, marginTop });

    return {
      isSticky,
      reachedUpperEdge,
      reachedLowerEdge,
    };

  }

  /**
   * Gets the offset for element. If the element
   * currently is sticky, it will get removed
   * to access the original position. Other
   * wise this would just be 0 for fixed elements. */
  private _determineElementOffsets(): StickyPositions {
    if (this.sticky) {
      this._removeSticky();
    }
    let bottomBoundary: number | null = null;

    if (this.boundaryElement) {
      const boundaryElementHeight = this.getComputedStyle(this.boundaryElement).height;
      const boundaryElementOffset = getPosition(this.boundaryElement).y;
      bottomBoundary = boundaryElementHeight + boundaryElementOffset;
    }

    return {
      offsetY: (getPosition(this._stickyElement.nativeElement).y - this.marginTop$.value), bottomBoundary,
    };
  }

  private _makeSticky(boundaryReached: boolean = false, marginTop: number, marginBottom: number): void {
    // do this before setting it to pos:fixed
    const { width, height, left } = this.getComputedStyle(this._stickyElement.nativeElement);
    const offSet = boundaryReached ? (this.getComputedStyle(this.boundaryElement).bottom - height - this.marginBottom$.value) : this.marginTop$.value;
    this._stickyElement.nativeElement.style.position = 'fixed';
    this._stickyElement.nativeElement.style.top = `${offSet}px`;
    this._stickyElement.nativeElement.style.left = `${left}px`;
    this._stickyElement.nativeElement.style.width = `${width}px`;

    if (this.spacerElement) {
      const spacerHeight = marginBottom + height + marginTop;
      this.spacerElement.style.height = `${spacerHeight}px`;
    }
  }

  private _checkSetup() {
    if (isDevMode() && !this.spacerElement) {
      console.warn(`******There might be an issue with your sticky directive!******

You haven't specified a spacer element. This will cause the page to jump.

Best practise is to provide a spacer element (e.g. a div) right before/after the sticky element.
Then pass the spacer element as input:

<div #spacer></div>

<div stickyThing="" [spacer]="spacer">
    I am sticky!
</div>`);
    }
  }


  private _setSticky(status: StickyStatus): void {
    if (status.isSticky) {
      if (this.upperBoundReached) {
        this._removeSticky();
        this.isSticky = false;
      } else {
        this._makeSticky(status.reachedLowerEdge, status.marginTop, status.marginBottom);
        this.isSticky = true;
      }
    } else {
      this._removeSticky();
    }
  }

  private _setStatus(status: StickyStatus) {
    this.upperBoundReached = status.reachedUpperEdge;
    this.boundaryReached = status.reachedLowerEdge;
    this.stickyStatus.next(status);
  }

  private _removeSticky(): void {
    this.boundaryReached = false;
    this.sticky = false;
    this._stickyElement.nativeElement.style.position = '';
    this._stickyElement.nativeElement.style.width = 'auto';
    this._stickyElement.nativeElement.style.left = 'auto';
    this._stickyElement.nativeElement.style.top = 'auto';
    if (this.spacerElement) {
      this.spacerElement.style.height = '0';
    }
  }
}

// Thanks to https://stanko.github.io/javascript-get-element-offset/
function getPosition(el) {
  let top = 0;
  let left = 0;
  let element = el;

  // Loop through the DOM tree
  // and add it's parent's offset to get page offset
  do {
    top += element.offsetTop || 0;
    left += element.offsetLeft || 0;
    element = element.offsetParent;
  } while (element);

  return {
    y: top,
    x: left,
  };
}
