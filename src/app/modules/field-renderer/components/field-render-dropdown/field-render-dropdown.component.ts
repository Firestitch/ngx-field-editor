import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { ControlContainer, FormsModule } from '@angular/forms';

import { OtherOption } from '../../../../consts';
import { FieldOption } from '../../../../interfaces';
import { FieldComponent } from '../field/field.component';
import { MatFormField, MatLabel, MatHint } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { FsFormModule } from '@firestitch/form';
import { MatOption } from '@angular/material/core';


@Component({
    selector: 'fs-field-render-dropdown',
    templateUrl: './field-render-dropdown.component.html',
    styleUrls: ['./field-render-dropdown.component.scss'],
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
        MatSelect,
        FormsModule,
        FsFormModule,
        MatOption,
        MatHint,
    ],
})
export class FieldRenderDropdownComponent extends FieldComponent {

  @Input() declare public field: FieldOption;

  public OtherOption = OtherOption;
}
