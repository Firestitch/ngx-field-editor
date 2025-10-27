import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Field } from '@firestitch/field-editor';
import { FieldRenderComponent as FieldRenderComponent_1 } from '../../../../src/app/modules/field-renderer/components/field-render/field-render.component';

@Component({
    selector: 'field-render',
    templateUrl: './field-render.component.html',
    styleUrls: ['./field-render.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [FieldRenderComponent_1],
})
export class FieldRenderComponent {

  public field: Field = {
    type: 'dropdown',
    label: 'Custom Dropdown',
    configs: {
      options: [
        {
          value: 'A',
          name: 'Option A',
        },
        {
          value: 'B',
          name: 'Option B',
        },
      ],
    },
  };
}
