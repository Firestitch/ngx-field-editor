import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FieldComponent } from '../field/field.component';
import { MatCheckbox } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { FsFormModule } from '@firestitch/form';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { NgClass } from '@angular/common';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';


@Component({
    selector: 'fs-field-config-address',
    templateUrl: './field-config-address.component.html',
    styleUrls: ['./field-config-address.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatCheckbox,
        FormsModule,
        FsFormModule,
        MatIconButton,
        MatTooltip,
        NgClass,
        MatFormField,
        MatInput,
    ],
})
export class FieldConfigAddressComponent extends FieldComponent {

  public fieldNames = ['street', 'address2', 'city', 'region', 'zip', 'country'];

  public toggleRequired(item): void {
    this.field.configs[item].required = !this.field.configs[item].required;
    this.fieldSave();
  }
}
