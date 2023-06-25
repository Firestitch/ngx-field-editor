import {
  Component,
  ContentChildren,
  QueryList,
  ChangeDetectionStrategy,
  Input,
  Optional,
} from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';

import { controlContainerFactory } from '@firestitch/core';

import { Observable, of } from 'rxjs';

import { FieldRenderDirective } from '../../directives/field-render/field-render.directive';
import { FieldRendererService } from '../../../services';

import { Field } from './../../../interfaces/field.interface';
import { FieldRendererConfig } from './../../../interfaces/field-renderer-config.interface';


@Component({
  selector: 'fs-field-renderer',
  templateUrl: './field-renderer.component.html',
  styleUrls: ['./field-renderer.component.scss'],
  providers: [FieldRendererService],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: controlContainerFactory,
      deps: [[new Optional(), NgForm]],
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldRendererComponent {

  @ContentChildren(FieldRenderDirective)
  public fieldRenders: QueryList<FieldRenderDirective>;

  constructor(
    public fieldRenderer: FieldRendererService,
  ) {}

  @Input('config')
  public set config(config: FieldRendererConfig) {
    this.fieldRenderer.setConfig(config);
  }

  public trackByGuid(index: number, field: Field) {
    return field.guid;
  }

  public get fields(): Field[] {
    return [
      ...this.fieldRenderer.config.fields,
    ];
  }

  public showField(field: Field): Observable<boolean> {
    if(!this.fieldRenderer.config.showField) {
      return of(true);
    }

    return this.fieldRenderer.config.showField(field);
  }
}
