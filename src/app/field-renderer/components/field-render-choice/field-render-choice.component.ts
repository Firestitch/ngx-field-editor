import { Component, ViewChild, ChangeDetectionStrategy, Optional } from '@angular/core';
import { ControlContainer, NgForm, NgModel } from '@angular/forms';

import { controlContainerFactory } from '@firestitch/core';

import { FieldComponent } from '../field/field.component';


@Component({
  selector: 'fs-field-render-choice',
  templateUrl: 'field-render-choice.component.html',
  styleUrls: ['field-render-choice.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: controlContainerFactory,
      deps: [[new Optional(), NgForm]],
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldRenderChoiceComponent extends FieldComponent {

  @ViewChild('radiobuttons', { read: NgModel })
  public radiobuttons: NgModel;

  public otherInputClick() {
    this.field.data.value.selected = 'other';
    this.changed.emit(this.field);
  }

  public radioChange() {
    this.changed.emit(this.field);
  }

  public validate = () => {
    if (this.field.config.configs.required === true && !this.radiobuttons.value) {
      throw 'This field is required';
    }
  }
}
