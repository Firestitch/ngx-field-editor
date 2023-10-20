import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';

import { FieldType } from '../../../../enums/field-type';
import { Field } from '../../../../interfaces';


@Component({
  selector: 'fs-field-view',
  templateUrl: './field-view.component.html',
  styleUrls: ['./field-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldViewComponent {

  @Input() public field: Field;

  public FieldType = FieldType;

}
