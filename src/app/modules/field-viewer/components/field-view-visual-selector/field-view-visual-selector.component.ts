import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

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
  }

  public field: FieldOption;

  public get configs() {
    return this.field.configs;
  }

  public VisualSelectorFormat = VisualSelectorFormat;

}
