import { ChangeDetectionStrategy, Component, Input, Optional } from '@angular/core';
import { ControlContainer, NgForm, FormsModule } from '@angular/forms';

import { controlContainerFactory } from '@firestitch/core';

import { FieldOption } from '../../../../interfaces';
import { FieldComponent } from '../field/field.component';
import { MatFormField, MatLabel, MatHint } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FsDatePickerModule } from '@firestitch/datepicker';
import { FsFormModule } from '@firestitch/form';


@Component({
    selector: 'fs-field-render-birthday',
    templateUrl: './field-render-birthday.component.html',
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
export class FieldRenderBirthdayComponent extends FieldComponent {

  @Input() declare public field: FieldOption;

  public curentDay = new Date();

}
