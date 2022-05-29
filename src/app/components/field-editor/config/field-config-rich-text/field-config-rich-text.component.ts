import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';

import { FsHtmlEditorComponent, FsHtmlEditorConfig } from '@firestitch/html-editor';

import { throwError } from 'rxjs';

import { FieldComponent } from '../../../field/field.component';
import { FieldEditorService } from '../../../../services/field-editor.service';


@Component({
  selector: 'fs-field-config-rich-text',
  templateUrl: 'field-config-rich-text.component.html',
  styleUrls: ['field-config-rich-text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldConfigRichTextComponent extends FieldComponent implements OnInit {

  @ViewChild(FsHtmlEditorComponent)
  public htmlEditor: FsHtmlEditorComponent;

  public config: FsHtmlEditorConfig;

  constructor(
    public fieldEditor: FieldEditorService,
  ) {
    super();
  }

  public ngOnInit(): void {
    super.ngOnInit();

    this.config = {
      ...this.field.config.configs,
      disabled: true,
      autofocus: false,
      image: {
        upload: (file: File) => {
          return this.fieldEditor.config.imageUpload ? 
           this.fieldEditor.config.imageUpload(this.field, file) :
           throwError('Image upload callback is not configured');
        }
      }
    };
  }
}
