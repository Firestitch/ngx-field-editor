import { ChangeDetectionStrategy, Component, Optional } from '@angular/core';
import { ControlContainer, NgForm, FormsModule } from '@angular/forms';

import { controlContainerFactory } from '@firestitch/core';

import { FieldComponent } from '../field/field.component';
import { MatFormField, MatLabel, MatHint } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FsDatePickerModule } from '@firestitch/datepicker';
import { FsFormModule } from '@firestitch/form';


@Component({
    selector: 'fs-field-render-time',
    templateUrl: './field-render-time.component.html',
    viewProviders: [
        {
            provide: ControlContainer,
            useFactory: controlContainerFactory,
            deps: [[new Optional(), NgForm]],
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
export class FieldRenderTimeComponent extends FieldComponent {

}
