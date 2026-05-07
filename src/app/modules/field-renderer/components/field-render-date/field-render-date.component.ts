import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ControlContainer, FormsModule } from '@angular/forms';

import { FieldComponent } from '../field/field.component';
import { MatFormField, MatLabel, MatHint } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FsDatePickerModule } from '@firestitch/datepicker';
import { FsFormModule } from '@firestitch/form';


@Component({
    selector: 'fs-field-render-date',
    templateUrl: './field-render-date.component.html',
    viewProviders: [
        {
            provide: ControlContainer,
            useFactory: () => inject(ControlContainer, { skipSelf: true, optional: true }),
        },
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatFormField,
        MatLabel,
        MatInput,
        FormsModule,
        FsDatePickerModule,
        FsFormModule,
        MatHint,
    ],
})
export class FieldRenderDateComponent extends FieldComponent {

}
