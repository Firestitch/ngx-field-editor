import {
  Component,
  ContentChildren,
  QueryList,
  ChangeDetectionStrategy,
  Input,
  Optional
} from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';

import { controlContainerFactory } from '@firestitch/core';

import { Field, FieldEditorConfig } from './../../interfaces/field.interface';
import { FieldRenderDirective } from './../../directives/field-render/field-render.directive';
import { FieldEditorService } from '../../services/field-editor.service';
import { FieldType } from '../../enums/field-type';


@Component({
  selector: 'fs-field-renderer',
  templateUrl: 'field-renderer.component.html',
  styleUrls: [ 'field-renderer.component.scss' ],
  providers: [
    FieldEditorService,
  ],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: controlContainerFactory,
      deps: [[new Optional(), NgForm]],
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldRendererComponent {

  @ContentChildren(FieldRenderDirective)
  public fieldRenders: QueryList<FieldRenderDirective>;

  constructor(
    public fieldEditor: FieldEditorService,
  ) {}

  @Input('config')
  set setConfig(config: FieldEditorConfig) {
    config.fields = config.fields.map((field) => {
      let data = field.data;
      if(field.config.type === FieldType.RichText) {
        data = { value: field.config.configs?.default || '' };
      }

      return {
        ...field,
        data,
      };
    });

    this.fieldEditor.setConfig(config);
  }

  public trackByGuid(index: number, item: Field) {
    return item.config.guid;
  }
}
