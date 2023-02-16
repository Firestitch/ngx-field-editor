import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';

import { FieldOption } from '../../../interfaces';
import { FieldType } from '../../../enums/field-type';
import { OtherOption } from '../../../consts';


@Component({
  selector: 'fs-field-view-options',
  templateUrl: 'field-view-options.component.html',
  styleUrls: ['field-view-options.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldViewOptionsComponent {

  @Input() public showLabel = true;
  @Input() public field: FieldOption;

  public fieldType = FieldType;
  public OtherOption = OtherOption;

}
