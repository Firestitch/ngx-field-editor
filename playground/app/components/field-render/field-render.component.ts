import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Field } from '@firestitch/field-editor';

@Component({
  selector: 'field-render',
  templateUrl: './field-render.component.html',
  styleUrls: ['./field-render.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
