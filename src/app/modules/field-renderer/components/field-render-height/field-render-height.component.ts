import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { ControlContainer, FormsModule } from '@angular/forms';

import { FsFormModule } from '@firestitch/form';

import { FieldOption } from '../../../../interfaces';
import { FieldComponent } from '../field/field.component';
import { FieldInputHeightComponent } from './field-input-height/field-input-height.component';
import { FieldSliderHeightComponent } from './field-slider-height/field-slider-height.component';


@Component({
  selector: 'fs-field-render-height',
  templateUrl: './field-render-height.component.html',
  styleUrls: ['./field-render-height.component.scss'],
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
    FieldInputHeightComponent,
    FieldSliderHeightComponent,
  ],
})
export class FieldRenderHeightComponent extends FieldComponent {

  @Input() declare public field: FieldOption;

  public get isSlider(): boolean {
    return this.field?.configs?.interface !== 'input';
  }

  public get showUnitToggle(): boolean {
    return this.field?.configs?.unitSelection !== false;
  }

  public get minFeet(): number {
    const min = Number(this.field?.configs?.min);

    return Number.isFinite(min) && min > 0 ? min : 4;
  }

  public get maxFeet(): number {
    const max = Number(this.field?.configs?.max);

    return Number.isFinite(max) && max > this.minFeet ? max : 7;
  }

}
