import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FieldComponent } from '../field/field.component';
import { MatCheckbox } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { FsFormModule } from '@firestitch/form';
import { MatFormField, MatLabel, MatPrefix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';


@Component({
    selector: 'fs-field-config-name',
    templateUrl: 'field-config-name.component.html',
    styleUrls: ['field-config-name.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatCheckbox,
        FormsModule,
        FsFormModule,
        MatFormField,
        MatLabel,
        MatInput,
        MatPrefix,
    ],
})
export class FieldConfigNameComponent extends FieldComponent {
}
