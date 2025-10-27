import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';

import { MatMenuTrigger, MatMenuItem, MatMenu } from '@angular/material/menu';

import { guid } from '@firestitch/common';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


import {
  BACKDROP_CLASS,
  TOOLBAR_MENU_CLASS,
} from '../../../../consts/backdrop-class';
import { TOOLBAR_DEFAULTS } from '../../../../helpers/toolbar-defaults';
import { Field, ToolbarItem, ToolbarItems } from '../../../../interfaces';
import { FieldEditorService } from '../../../../services';
import { MatMiniFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { NgTemplateOutlet } from '@angular/common';
import { FieldToolbarItemComponent } from '../field-toolbar-item/field-toolbar-item.component';


@Component({
    selector: 'fs-field-toolbar',
    templateUrl: './field-toolbar.component.html',
    styleUrls: ['./field-toolbar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatMiniFabButton,
        MatMenuTrigger,
        MatIcon,
        MatMenuItem,
        MatMenu,
        NgTemplateOutlet,
        FieldToolbarItemComponent,
    ],
})
export class FieldToolbarComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input()
  public toolbarItems: ToolbarItems = [];

  @Input()
  public parentItem: ToolbarItem;

  @Input()
  public rootTriggerRef: MatMenuTrigger;

  @Output()
  public itemClick = new EventEmitter<string>();

  @ViewChild('trigger')
  public triggerRef: MatMenuTrigger;

  @ViewChild('childTrigger')
  public childTrigger: MatMenuTrigger;

  @ViewChildren(FieldToolbarComponent)
  public childrenToolbarItems: QueryList<FieldToolbarComponent>;

  public items: ToolbarItems = [];
  public readonly backdropClass = BACKDROP_CLASS;
  public readonly menuClass = TOOLBAR_MENU_CLASS;
  public field: Field = null;
  public expanded = true;
  public withSections = false;
  public uuid = guid();

  private _closed = true;
  private _destroy$ = new Subject<void>();

  constructor(
    public fieldEditor: FieldEditorService,
  ) { }

  public ngOnInit(): void {
    if (!this.parentItem) {
      this.items = this.toolbarItems;
      this._initItems(this.toolbarItems);
    } else {
      this.items = this.parentItem.items;
      this._initItems(this.parentItem.items);
    }
  }

  public ngAfterViewInit(): void {
    this.childTrigger?.menuClosed
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => this._closed = true);
  }


  public ngOnDestroy(): void {
    this._destroy$.next(null);
    this._destroy$.complete();
  }

  public closeChildItems(uuid: string): void {
    const childComponents = this.childrenToolbarItems.toArray();

    childComponents.forEach((toolbarItem: FieldToolbarComponent) => {
      if (toolbarItem.uuid !== uuid) {
        toolbarItem.closeMenu();
      }
    });
  }

  public handleMenuItemClick(event: Event): void {
    event.preventDefault();

    this.toggleMenuItem();

    this.itemClick.emit(this.uuid);
  }

  public toggleMenuItem(): void {
    this._closed = !this._closed;

    if (this._closed) {
      this.closeMenu();
    }
  }

  public closeMenu(): void {
    this._closed = true;

    this.childTrigger.closeMenu();
  }

  private _initItems(items: ToolbarItems): void {
    items.forEach((item) => {
      if (item.items) {
        this._initItems(item.items);
        this.withSections = true;
      } else {
        if (!item.icon || !item.label) {
          const ditem = TOOLBAR_DEFAULTS[item.type];

          if (ditem) {
            item.icon = item.icon ?? ditem.icon;
            item.label = item.label ?? ditem.label;
          }
        }
      }
    });
  }
}
