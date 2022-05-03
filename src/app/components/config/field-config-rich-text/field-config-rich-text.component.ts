import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FsHtmlEditorConfig } from '@firestitch/html-editor';

import { FieldComponent } from '../../field/field.component';
import { FieldEditorService } from '../../../services/field-editor.service';

@Component({
  selector: 'fs-field-config-rich-text',
  templateUrl: 'field-config-rich-text.component.html',
  styleUrls: ['field-config-rich-text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldConfigRichTextComponent extends FieldComponent implements OnInit {

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
