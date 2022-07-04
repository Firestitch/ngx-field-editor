import { Component } from '@angular/core';
import { FieldType } from '@firestitch/field-editor';

@Component({
  selector: 'field-view',
  templateUrl: 'field-view.component.html',
  styleUrls: ['field-view.component.scss']
})
export class FieldViewComponent {

  public field = {
      data: {
        value: {
          selected: ['A','B', 'other'],
          other: 'Another One',
        },
      },
      config: {
          type: FieldType.Checkbox,
          label: 'Custom Dropdown',
          configs: {
              options: [
              {
                value: 'A',
                name: 'Option A'
              },
              {
                value: 'B',
                name: 'Option B'
              }
            ]
          }
      }
    }
}
