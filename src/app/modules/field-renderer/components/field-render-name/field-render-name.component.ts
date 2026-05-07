import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { ControlContainer, FormsModule } from '@angular/forms';

import { Field } from '../../../../interfaces';
import { FieldComponent } from '../field/field.component';
import { FieldRenderNameModelComponent } from './field-render-name-model/field-render-name-model.component';
import { FsFormModule } from '@firestitch/form';


@Component({
    selector: 'fs-field-render-name',
    templateUrl: './field-render-name.component.html',
    styleUrls: ['./field-render-name.component.scss'],
    viewProviders: [
        {
            provide: ControlContainer,
            useFactory: () => inject(ControlContainer, { skipSelf: true, optional: true }),
        },
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        FieldRenderNameModelComponent,
        FormsModule,
        FsFormModule,
    ],
})
export class FieldRenderNameComponent extends FieldComponent {

  @Input('field')
  public set _field(field: Field) {
    this.field = field;

    if (!field.data || !field.data.guid || !field.data.value) {
      field.data = {
        value: {
          firstName: null,
          middleName: null,
          lastName: null,
        },
      };
    }
  }

}
