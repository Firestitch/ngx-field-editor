import { ChangeDetectionStrategy, Component, Input, ChangeDetectorRef } from '@angular/core';

import { FieldOption } from '../../../../interfaces';
import { VisualSelectorFormat } from '../../../../enums';
import { initField } from '../../../../helpers/init-field';


@Component({
  selector: 'fs-field-view-visual-selector',
  templateUrl: './field-view-visual-selector.component.html',
  styleUrls: ['./field-view-visual-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldViewVisualSelectorComponent {

  @Input('field')
  public set setField(field) {
    this.field = initField(field);
    this._selectedUpdate(this.field);
    this._cdRef.markForCheck();
  }

  public field: FieldOption;

  public get configs() {
    return this.field.configs;
  }

  public selected: any = {};

  public VisualSelectorFormat = VisualSelectorFormat;

  constructor(
    private _cdRef: ChangeDetectorRef,
  ) { }

  private _selectedUpdate(field: FieldOption): void {
    this.selected = {};
    field.options
      .forEach((option) => {
        this.selected[option.guid] = (field.data.value?.selected || []).indexOf(option.guid) !== -1;
      });
  }

}
