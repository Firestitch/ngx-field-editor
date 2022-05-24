import { ChangeDetectionStrategy, Component, OnInit, Optional } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';

import { parse, parseLocal } from '@firestitch/date';
import { controlContainerFactory } from '@firestitch/core';

import { FieldComponent } from '../../field/field.component';


@Component({
  selector: 'fs-field-render-date',
  templateUrl: 'field-render-date.component.html',
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: controlContainerFactory,
      deps: [[new Optional(), NgForm]],
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldRenderDateComponent extends FieldComponent implements OnInit {

  public ngOnInit(): void {
    super.ngOnInit();

    this.field.data.value = parseLocal(this.field.data.value);
  }

}
