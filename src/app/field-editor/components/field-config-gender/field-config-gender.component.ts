import { Component, ChangeDetectionStrategy } from '@angular/core';

import { FieldComponent } from '../field/field.component';


@Component({
  selector: 'fs-field-config-gender',
  templateUrl: 'field-config-gender.component.html',
  styleUrls: ['field-config-gender.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldConfigGenderComponent extends FieldComponent {

}
