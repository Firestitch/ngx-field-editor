import { ChangeDetectionStrategy, Component, Input, OnInit, Optional } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';

import { controlContainerFactory } from '@firestitch/core';

import { FieldComponent } from '../field/field.component';
import { FieldOption } from '../../../interfaces';


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

  @Input() public field: FieldOption;

  public curentDay = new Date();

}
