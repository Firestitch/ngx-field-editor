import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FsHtmlEditorConfig } from '@firestitch/html-editor';

import { FieldComponent } from '../../field/field.component';
import { FieldEditorService } from '../../../services/field-editor.service';

@Component({
  selector: 'fs-field-config-content',
  templateUrl: 'field-config-content.component.html',
  styleUrls: ['field-config-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldConfigContentComponent extends FieldComponent implements OnInit {

  public config: FsHtmlEditorConfig = {};

  constructor(
    public fieldEditor: FieldEditorService,
  ) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();

    this.config = {
      ...this.field.config.configs,
      autofocus: false,
    };
  }

}
