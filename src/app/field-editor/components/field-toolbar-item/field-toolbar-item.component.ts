import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { MatMenuTrigger } from '@angular/material/menu';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

import { guid } from '@firestitch/common';

import { cloneDeep } from 'lodash-es';

import { ToolbarItem } from '../../../interfaces/toolbar.interface';
import { Field } from '../../../interfaces/field.interface';
import { BACKDROP_CLASS, BACKDROP_HIDDEN_CLASS } from '../../../consts/backdrop-class';
import { FieldEditorService } from '../../../services/field-editor.service';


@Component({
  selector: 'fs-field-toolbar-item',
  templateUrl: 'field-toolbar-item.component.html',
  styleUrls: ['field-toolbar-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldToolbarItemComponent {

  @Input()
  public item: ToolbarItem;

  @Input()
  public menuTrigger: MatMenuTrigger;

  public field: Field = null;

  constructor(
    public fieldEditor: FieldEditorService,
  ) { }

  private get _backdrop(): Element {
    return document.getElementsByClassName(BACKDROP_CLASS).item(0);
  }

  public dragStarted(item: ToolbarItem): void {
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
    this._restoreMenuBackdrop();

    if (event.container !== event.previousContainer) {
      this.menuTrigger.closeMenu();
    }
  }

  public itemClick(item: ToolbarItem): void {
    const field = this._prepareField(item);
    this.fieldEditor.insertNewField(
      cloneDeep(field),
      undefined,
      item,
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
