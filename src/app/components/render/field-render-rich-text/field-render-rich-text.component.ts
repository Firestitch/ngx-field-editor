import { ChangeDetectionStrategy, Component, OnInit, Optional } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';

import { FsHtmlEditorConfig } from '@firestitch/html-editor';
import { controlContainerFactory } from '@firestitch/core';

import { FieldEditorService } from '../../../services/field-editor.service';
import { FieldComponent } from '../../field/field.component';


@Component({
  selector: 'fs-field-render-rich-text',
  styleUrls: ['./field-render-rich-text.component.scss'],
  templateUrl: 'field-render-rich-text.component.html',
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: controlContainerFactory,
      deps: [[new Optional(), NgForm]],
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldRenderRichTextComponent extends FieldComponent implements OnInit {

  public editorConfig: FsHtmlEditorConfig;

  constructor(public fieldEditor: FieldEditorService) {
    super();
  }

}
