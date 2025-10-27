import { Component, ChangeDetectionStrategy } from '@angular/core';

import { FieldComponent } from '../field/field.component';
import { FieldConfigOptionsComponent } from '../field-config-options/field-config-options.component';


@Component({
    selector: 'fs-field-config-gender',
    templateUrl: 'field-config-gender.component.html',
    styleUrls: ['field-config-gender.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [FieldConfigOptionsComponent],
})
export class FieldConfigGenderComponent extends FieldComponent {

}
