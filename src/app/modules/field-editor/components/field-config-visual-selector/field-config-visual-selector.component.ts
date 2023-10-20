import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { VisualSelectorFormat } from '../../../../enums';
import { FieldEditorService } from '../../../../services';
import { FieldComponent } from '../field/field.component';


@Component({
  selector: 'fs-field-config-visual-selector',
  templateUrl: './field-config-visual-selector.component.html',
  styleUrls: ['./field-config-visual-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldConfigVisualSelectorComponent extends FieldComponent {

  @Input() public fieldEditor: FieldEditorService;

  public VisualSelectorFormat = VisualSelectorFormat;

}
