import { ChangeDetectionStrategy, Component, Input, Optional } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';

import { controlContainerFactory } from '@firestitch/core';

import { OtherOption } from '../../../../consts';
import { FieldOption } from '../../../../interfaces';
import { FieldComponent } from '../field/field.component';


@Component({
  selector: 'fs-field-render-dropdown',
  templateUrl: './field-render-dropdown.component.html',
  styleUrls: ['./field-render-dropdown.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: controlContainerFactory,
      deps: [[new Optional(), NgForm]],
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldRenderDropdownComponent extends FieldComponent {

  @Input() public field: FieldOption;

  public OtherOption = OtherOption;
}
