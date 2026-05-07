import { ChangeDetectionStrategy, Component, ContentChildren, Input, QueryList, inject } from '@angular/core';
import { ControlContainer } from '@angular/forms';


import { FieldRendererService } from '../../../../services';
import { FieldRenderDirective } from '../../directives/field-render/field-render.directive';

import { Field, FieldRendererConfig } from './../../../../interfaces';
import { FieldRenderComponent } from '../field-render/field-render.component';


@Component({
    selector: 'fs-field-renderer',
    templateUrl: './field-renderer.component.html',
    styleUrls: ['./field-renderer.component.scss'],
    providers: [FieldRendererService],
    viewProviders: [
        {
            provide: ControlContainer,
            useFactory: () => inject(ControlContainer, { skipSelf: true, optional: true }),
        },
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [FieldRenderComponent],
})
export class FieldRendererComponent {
  fieldRenderer = inject(FieldRendererService);


  @ContentChildren(FieldRenderDirective)
  public fieldRenders: QueryList<FieldRenderDirective>;

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
}
