import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';

import { Field } from '../../../interfaces/field.interface';
import { FieldType } from '../../../enums/field-type';
import { FieldEditorService } from '../../../services/field-editor.service';


@Component({
  selector: 'fs-field-view',
  templateUrl: 'field-view.component.html',
  styleUrls: ['field-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldViewComponent implements OnInit {

  @Input() public showLabel = true;
  @Input() public field: Field;

  public fieldType = FieldType;
  public actions = [];

  constructor(
    private _fieldEditor: FieldEditorService,
  ) {}

  public ngOnInit() {
    this._initActions();
  }

  private _initActions(): void {
    if (this._fieldEditor.config && this._fieldEditor.config.fileDownload) {
      this.actions.push({
        label: 'Download',
        click: (item) => {
          this._fieldEditor.config.fileDownload(this.field, item);
        }
      });
    }
  }
}
