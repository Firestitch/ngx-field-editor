import { ChangeDetectionStrategy, Component } from '@angular/core';

import { VisualSelectorFormat } from '../../../../enums';
import { FieldComponent } from '../field/field.component';


@Component({
  selector: 'fs-field-config-visual-selector',
  templateUrl: './field-config-visual-selector.component.html',
  styleUrls: ['./field-config-visual-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldConfigVisualSelectorComponent extends FieldComponent {

  public VisualSelectorFormat = VisualSelectorFormat;

}
