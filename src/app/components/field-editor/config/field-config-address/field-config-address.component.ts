import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FieldComponent } from '../../../field/field.component';


@Component({
  selector: 'fs-field-config-address',
  templateUrl: 'field-config-address.component.html',
  styleUrls: ['field-config-address.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldConfigAddressComponent extends FieldComponent {
  public fieldNames = ['street', 'address2', 'city', 'region', 'zip', 'country'];
}
