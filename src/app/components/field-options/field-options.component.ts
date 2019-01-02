import { Component, Input } from '@angular/core';

import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

import { FsPrompt } from '@firestitch/prompt';
import { guid } from '@firestitch/common/util';

import { Field, FieldOption } from '../../interfaces';


@Component({
  selector: 'fs-form-field-options',
  templateUrl: 'field-options.component.html',
  styleUrls: [ 'field-options.component.scss' ],
})
export class FieldOptionsComponent {
  public newOption = '';

  @Input() field: Field;
  @Input() fields: Field[];

  constructor(
    private fsPrompt: FsPrompt,
  ) {}

  addOption() {

    if (this.newOption.length) {

      if (!this.field.field_options) {
        this.field.field_options = [];
      }

      this.field.field_options.push({
        guid: guid(),
        label: this.newOption,
      });

      this.newOption = '';
    }
  }

  removeOption(index: number) {
    this.fsPrompt.confirm({
      title: 'Confirm',
      template: 'Are you sure you would like to remove this option?',
    }).subscribe((value) => {
        this.field.field_options.splice(index, 1);
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.field.field_options, event.previousIndex, event.currentIndex);
  }
}
