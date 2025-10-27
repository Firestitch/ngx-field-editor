import { ChangeDetectionStrategy, Component, Optional } from '@angular/core';
import { ControlContainer, NgForm, FormsModule } from '@angular/forms';

import { controlContainerFactory } from '@firestitch/core';

import { FieldComponent } from '../field/field.component';
import { MatFormField, MatLabel, MatHint } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FsFormModule } from '@firestitch/form';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { FsDatePickerModule } from '@firestitch/datepicker';
import { FsPhoneModule } from '@firestitch/phone';


@Component({
    selector: 'fs-field-render-text',
    templateUrl: './field-render-text.component.html',
    styleUrls: ['./field-render-text.component.scss'],
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
        FsFormModule,
        MatHint,
        CdkTextareaAutosize,
        FsDatePickerModule,
        FsPhoneModule,
    ],
})
export class FieldRenderTextComponent extends FieldComponent {

}
