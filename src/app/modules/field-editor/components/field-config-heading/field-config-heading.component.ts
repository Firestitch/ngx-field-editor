import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FieldComponent } from '../field/field.component';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { FsFormModule } from '@firestitch/form';
import { MatOption } from '@angular/material/core';


@Component({
    selector: 'fs-field-config-heading',
    templateUrl: './field-config-heading.component.html',
    styleUrls: ['./field-config-heading.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatFormField,
        MatLabel,
        MatSelect,
        FormsModule,
        FsFormModule,
        MatOption,
    ],
})
export class FieldConfigHeadingComponent extends FieldComponent {
}
