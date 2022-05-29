import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FieldComponent } from '../../../field/field.component';


@Component({
  selector: 'fs-field-config-heading',
  templateUrl: 'field-config-heading.component.html',
  styleUrls: ['field-config-heading.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldConfigHeadingComponent extends FieldComponent {
}
