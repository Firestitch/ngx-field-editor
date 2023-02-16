import { Component, ChangeDetectionStrategy, OnInit, Input } from '@angular/core';

import { ToolbarItem, ToolbarItems } from '../../../interfaces/toolbar.interface';
import { TOOLBAR_DEFAULTS } from '../../../helpers/toolbar-defaults';
import {
  BACKDROP_CLASS,
  TOOLBAR_MENU_CLASS,
} from '../../../consts/backdrop-class';


@Component({
  selector: 'field-nested-toolbar-items',
  templateUrl: 'field-nested-toolbar-items.component.html',
  styleUrls: [ 'field-nested-toolbar-items.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldNestedToolbarItemsComponent implements OnInit {
  @Input()
  public item: ToolbarItem;

  public readonly backdropClass = BACKDROP_CLASS;
  public readonly menuClass = TOOLBAR_MENU_CLASS;

  public withSections = false;

  constructor() {}

  public ngOnInit() {
    this._initItems(this.item.items);
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
