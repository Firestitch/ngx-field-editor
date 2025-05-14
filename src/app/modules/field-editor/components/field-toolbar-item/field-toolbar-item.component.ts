import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { MatMenuTrigger } from '@angular/material/menu';

import { guid } from '@firestitch/common';

import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { cloneDeep } from 'lodash-es';

import { BACKDROP_CLASS, BACKDROP_HIDDEN_CLASS } from '../../../../consts/backdrop-class';
import { Field, ToolbarItem } from '../../../../interfaces';
import { FieldEditorService } from '../../../../services';


@Component({
  selector: 'fs-field-toolbar-item',
  templateUrl: './field-toolbar-item.component.html',
  styleUrls: ['./field-toolbar-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldToolbarItemComponent {

  @Input()
  public item: ToolbarItem;

  @Input()
  public menuTrigger: MatMenuTrigger;

  public field: Field = null;
  public dragging = false;

  constructor(
    public fieldEditor: FieldEditorService,
  ) { }

  private get _backdrop(): Element {
    return document.getElementsByClassName(BACKDROP_CLASS).item(0);
  }

  public dragStarted(item: ToolbarItem): void {
    this.dragging = true;
    this._hideMenuBackdrop();
    this.fieldEditor.unselectField();

    this.field = {
      guid: guid(),
      type: item.type,
      label: item.label,
      description: '',
      data: {
        value: null,
        guid: guid(),
      },
    };
  }

  public dragDropped(event: CdkDragDrop<any>): void {
    this.dragging = false;
    this._restoreMenuBackdrop();

    if (event.container !== event.previousContainer) {
      this.menuTrigger.closeMenu();
    }
  }

  public itemClick(toolbarItem: ToolbarItem): void {
    of(this._prepareField(toolbarItem))
      .pipe(
        switchMap((field: Field) => {
          return toolbarItem.click ? toolbarItem.click(field, toolbarItem) : of(field);
        }),
        switchMap((field) => {
          return this.fieldEditor.appendField(
            cloneDeep(field),
            toolbarItem,
          );
        }),
      )
      .subscribe();
  }

  private _hideMenuBackdrop(): void {
    const backdropEl = this._backdrop;

    if (backdropEl) {
      backdropEl.classList.add(BACKDROP_HIDDEN_CLASS);
    }
  }

  private _restoreMenuBackdrop(): void {
    const backdropEl = this._backdrop;

    if (backdropEl) {
      backdropEl.classList.remove(BACKDROP_HIDDEN_CLASS);
    }
  }

  private _prepareField(item: ToolbarItem): Field {
    return {
      guid: guid(),
      type: item.type,
      label: item.label,
      description: '',
      data: {
        value: null,
        guid: guid(),
      },
    };
  }
}
