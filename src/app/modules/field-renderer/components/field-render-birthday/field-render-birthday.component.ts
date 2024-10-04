import { ChangeDetectionStrategy, Component, Input, Optional } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';

import { controlContainerFactory } from '@firestitch/core';

import { FieldOption } from '../../../../interfaces';
import { FieldComponent } from '../field/field.component';


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
})
export class FieldRenderBirthdayComponent extends FieldComponent {

  @Input() declare public field: FieldOption;

  public curentDay = new Date();

}
