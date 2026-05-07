import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { ControlContainer, FormsModule } from '@angular/forms';

import { FsFormModule } from '@firestitch/form';

import { FieldOption } from '../../../../interfaces';
import { FieldComponent } from '../field/field.component';
import { FieldInputWeightComponent } from './field-input-weight/field-input-weight.component';
import { FieldSliderWeightComponent } from './field-slider-weight/field-slider-weight.component';


@Component({
  selector: 'fs-field-render-weight',
  templateUrl: './field-render-weight.component.html',
  styleUrls: ['./field-render-weight.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true, optional: true }),
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,
    FsFormModule,
    FieldInputWeightComponent,
    FieldSliderWeightComponent,
  ],
})
export class FieldRenderWeightComponent extends FieldComponent {

  @Input() declare public field: FieldOption;

  public get isSlider(): boolean {
    return this.field?.configs?.interface !== 'input';
  }

  public get showUnitToggle(): boolean {
    return this.field?.configs?.unitSelection !== false;
  }

  public get minLb(): number {
    const min = Number(this.field?.configs?.min);

    return Number.isFinite(min) && min > 0 ? min : 80;
  }

  public get maxLb(): number {
    const max = Number(this.field?.configs?.max);

    return Number.isFinite(max) && max > this.minLb ? max : 400;
  }

}
