import { ChangeDetectionStrategy, Component, OnInit, Optional } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';

import { FsHtmlEditorConfig } from '@firestitch/html-editor';
import { controlContainerFactory } from '@firestitch/core';

import { FieldEditorService } from '../../../services/field-editor.service';
import { FieldComponent } from '../../field/field.component';


@Component({
  selector: 'fs-field-render-paragraph',
  styleUrls: ['./field-render-paragraph.component.scss'],
  templateUrl: 'field-render-paragraph.component.html',
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: controlContainerFactory,
      deps: [[new Optional(), NgForm]],
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldRenderParagraphComponent extends FieldComponent implements OnInit {

  public editorConfig: FsHtmlEditorConfig;

  constructor(public fieldEditor: FieldEditorService) {
    super();
  }

  public ngOnInit(): void {
    super.ngOnInit();

    this.editorConfig = {
      autofocus: false,
      disabled: true,
    };
  }

}
