import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';

import { Field } from '../../interfaces/field.interface';
import { FieldType } from '../../enums/field-type';


@Component({
  selector: 'fs-field-view',
  templateUrl: 'field-view.component.html',
  styleUrls: ['field-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldViewComponent {

  @Input() public showLabel = true;
  @Input() public field: Field;

  public fieldType = FieldType;
}
