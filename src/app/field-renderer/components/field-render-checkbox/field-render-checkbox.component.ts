import { ChangeDetectionStrategy, Component, ViewChild, Optional } from '@angular/core';
import { ControlContainer, NgForm, NgModel } from '@angular/forms';

import { controlContainerFactory } from '@firestitch/core';

import { FieldComponent } from '../field/field.component';


@Component({
  selector: 'fs-field-render-checkbox',
  templateUrl: 'field-render-checkbox.component.html',
  styleUrls: [ 'field-render-checkbox.component.scss' ],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: controlContainerFactory,
      deps: [[new Optional(), NgForm]],
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldRenderCheckboxComponent extends FieldComponent {

  @ViewChild('checkboxes', { read: NgModel }) public checkboxes: NgModel;

  public otherInputClick(event: MouseEvent) {

    if (this.field.data.value.selected.indexOf('other') === -1) {
      this.field.data.value.selected = [ ...this.field.data.value.selected, 'other' ];
    }

    this.checkboxes.control.updateValueAndValidity();
  }
  public otherCheckboxClick(event: KeyboardEvent) {
    event.preventDefault();
    this.checkboxes.control.updateValueAndValidity();
    this.changed.emit(this.field);
  }

  public compareWith(o1, o2) {
    return o1 && o2 && o1 == o2;
  }

  public validate = () => {
    if (this.field.configs.required === true && !this.field.data.value.selected.length) {
      throw 'This field is required';
    }
  }

}
