import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FieldComponent } from '../field/field.component';


@Component({
  selector: 'fs-field-config-name',
  templateUrl: 'field-config-name.component.html',
  styleUrls: ['field-config-name.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldConfigNameComponent extends FieldComponent {
}
