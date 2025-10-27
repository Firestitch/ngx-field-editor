import { ChangeDetectionStrategy, Component, Input, Optional } from '@angular/core';
import { ControlContainer, NgForm, FormsModule } from '@angular/forms';

import { controlContainerFactory } from '@firestitch/core';

import { FieldOption } from '../../../../interfaces';
import { FieldComponent } from '../field/field.component';
import { FsRadioGroupModule } from '@firestitch/radiogroup';
import { FsFormModule } from '@firestitch/form';
import { MatRadioButton } from '@angular/material/radio';
import { MatHint } from '@angular/material/form-field';


@Component({
    selector: 'fs-field-render-gender',
    styleUrls: ['./field-render-gender.component.scss'],
    templateUrl: './field-render-gender.component.html',
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
        FsRadioGroupModule,
        FormsModule,
        FsFormModule,
        MatRadioButton,
        MatHint,
    ],
})
export class FieldRenderGenderComponent extends FieldComponent {

  @Input() declare public field: FieldOption;

}
