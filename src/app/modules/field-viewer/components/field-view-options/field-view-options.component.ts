import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';

import { OtherOption } from '../../../../consts';
import { FieldType } from '../../../../enums/field-type';
import { FieldOption } from '../../../../interfaces';
import { NgTemplateOutlet } from '@angular/common';
import { FieldViewVisualSelectorComponent } from '../field-view-visual-selector/field-view-visual-selector.component';


@Component({
    selector: 'fs-field-view-options',
    templateUrl: './field-view-options.component.html',
    styleUrls: ['./field-view-options.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NgTemplateOutlet, FieldViewVisualSelectorComponent],
})
export class FieldViewOptionsComponent {

  @Input() public showLabel = true;
  @Input() public field: FieldOption;

  public fieldType = FieldType;
  public OtherOption = OtherOption;

}
