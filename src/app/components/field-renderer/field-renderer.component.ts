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
    this.fieldEditor.setConfig(config);
  }

  public trackByGuid(index: number, item: Field) {
    return item.config.guid;
  }
}
