import { Component, Input, AfterContentInit, ChangeDetectionStrategy, Optional } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';

import { controlContainerFactory } from '@firestitch/core';

import { FieldRenderDirective } from '../../directives/field-render/field-render.directive';
import { initField } from '../../../helpers/init-field';
import { Field, FieldRendererConfig } from './../../../interfaces';
import { FieldRendererService } from '../../../services';
import { FieldType } from '../../../enums/field-type';


@Component({
  selector: 'fs-field-render',
  styleUrls: ['field-render.component.scss'],
  templateUrl: 'field-render.component.html',
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: controlContainerFactory,
      deps: [[new Optional(), NgForm]],
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldRenderComponent implements AfterContentInit {

  public fieldRenderTemplateRefs = {};
  public field: Field = {};
  public fieldType = FieldType;

  @Input()
  public fieldRenders: FieldRenderDirective[] = [];

  constructor(
    @Optional() public fieldRenderer: FieldRendererService,
  ) {}

  @Input('field')
  public set setField(field) {
    this.field = initField(field);
  }

  public ngAfterContentInit(): void {
    this.fieldRenders.forEach((directive: FieldRenderDirective) => {
      this.fieldRenderTemplateRefs[directive.type] = directive.templateRef;
    });
  }
}
