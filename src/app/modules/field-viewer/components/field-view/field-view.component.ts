import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';

import { parseLocal } from '@firestitch/date';

import { FieldType } from '../../../../enums/field-type';
import { initField } from '../../../../helpers';
import { Field } from '../../../../interfaces';


@Component({
  selector: 'fs-field-view',
  templateUrl: './field-view.component.html',
  styleUrls: ['./field-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldViewComponent implements OnInit {

  @Input() public field: Field;
  @Input() public data: any;

  public FieldType = FieldType;

  public ngOnInit(): void {
    if(this.data) {
      this.field.data = this.data;
    }

    this.field = initField(this.field);
  }

  public get dateLocal(): Date {
    if ((this.field.type as FieldType) !== FieldType.Date) {
      return null;
    }

    return parseLocal(this.field.data.value);
  }

}
