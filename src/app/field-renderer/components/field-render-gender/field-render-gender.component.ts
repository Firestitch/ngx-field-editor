import { ChangeDetectionStrategy, Component, Input, Optional } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';

import { controlContainerFactory } from '@firestitch/core';

import { FieldComponent } from '../field/field.component';
import { FieldOption } from '../../../interfaces';


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
})
export class FieldRenderGenderComponent extends FieldComponent {

  @Input() public field: FieldOption;

}
