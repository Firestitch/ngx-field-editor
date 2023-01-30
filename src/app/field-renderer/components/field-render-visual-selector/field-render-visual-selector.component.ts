import { ChangeDetectionStrategy, Component, Optional } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';

import { controlContainerFactory } from '@firestitch/core';
import { VisualSelectorFormat } from '../../../enums';

import { FieldComponent } from '../field/field.component';


@Component({
  selector: 'fs-field-render-visual-selector',
  templateUrl: 'field-render-visual-selector.component.html',
  styleUrls: [ 'field-render-visual-selector.component.scss' ],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: controlContainerFactory,
      deps: [[new Optional(), NgForm]],
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldRenderVisualSelectorComponent extends FieldComponent {

  public selected = {};
  public VisualSelectorFormat = VisualSelectorFormat;

  public ngOnInit(): void {
    super.ngOnInit();

    this.selected = this.field.data.value.selected
    .reduce((accum, guid) => {
      return {
        ...accum,
        [guid]: true,
      }
    }, {});
  }

  public validate = () => {
    if (this.field.config.configs.required === true && !this.field.data.value.selected.length) {
      throw 'This field is required';
    }
  }

  public select(option): void {
    const selected = !this.selected[option.guid];

    if(!this.configs.multipleSelection) {
      this.selected = {};  
    }

    this.selected[option.guid] = selected;
    this.field.data.value.selected = Object.keys(this.selected);
    this.changed.emit(this.field);
  }
}
