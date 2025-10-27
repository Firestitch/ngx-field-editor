import { ChangeDetectionStrategy, Component, Input, Optional } from '@angular/core';
import { ControlContainer, NgForm, FormsModule } from '@angular/forms';

import { controlContainerFactory } from '@firestitch/core';

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
            useFactory: controlContainerFactory,
            deps: [[new Optional(), NgForm]],
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
