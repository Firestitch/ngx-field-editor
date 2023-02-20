import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ToolbarItem, ToolbarItems } from '../../../interfaces/toolbar.interface';
import { Field } from '../../../interfaces/field.interface';
import { TOOLBAR_DEFAULTS } from '../../../helpers/toolbar-defaults';
import {
  BACKDROP_CLASS,
  TOOLBAR_MENU_CLASS,
} from '../../../consts/backdrop-class';
import { FieldEditorService } from '../../../services/field-editor.service';


@Component({
  selector: 'fs-field-toolbar',
  templateUrl: 'field-toolbar.component.html',
  styleUrls: [ 'field-toolbar.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldToolbarComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @Input()
  public toolbarItems: ToolbarItems = [];
  @Input()
  public nestedItem: ToolbarItem;
  @Input()
  public rootTriggerRef: MatMenuTrigger;

  @ViewChild('trigger', { static: false })
  public triggerRef: MatMenuTrigger;
  @ViewChild('subTrigger', { static: false })
  public subTrigger: MatMenuTrigger;

  public items: ToolbarItems = [];
  public readonly backdropClass = BACKDROP_CLASS;
  public readonly menuClass = TOOLBAR_MENU_CLASS;

  public field: Field = null;
  public expanded = true;
  public withSections = false;

  private _closed = true;
  private _destroy$ = new Subject<void>();

  constructor(
    public fieldEditor: FieldEditorService,
  ) {}

  public ngOnInit() {
    if (!this.nestedItem) {
      this.items = this.toolbarItems;
      this._initItems(this.toolbarItems);
    } else {
      this.items = this.nestedItem.items;
      this._initItems(this.nestedItem.items);
    }
  }

  public ngAfterViewInit(): void {
    this.subTrigger?.menuClosed
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => this._closed = true);
  }

  public hadleMenuItemClick(event: Event): void {
    event.preventDefault();

    this._closed = !this._closed;

    if (this._closed) {
      this.subTrigger.closeMenu();
    }
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _initItems(items: ToolbarItems) {
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
