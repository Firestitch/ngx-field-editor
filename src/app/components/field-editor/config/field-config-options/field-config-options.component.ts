import { Component, Input, ViewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';

import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { FsPrompt } from '@firestitch/prompt';
import { guid } from '@firestitch/common';

import { FieldComponent } from '../../../field/field.component';
import { FieldEditorService } from '../../../../services/field-editor.service';
import { forkJoin } from 'rxjs';
import { filter } from 'rxjs/operators';


@Component({
  selector: 'fs-field-config-options',
  templateUrl: 'field-config-options.component.html',
  styleUrls: ['field-config-options.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldConfigOptionsComponent extends FieldComponent {

  public newOption = '';

  @ViewChild('addOptionInput', { static: true })
  private _addOptionInput: ElementRef;

  constructor(
    public fieldEditor: FieldEditorService,
    private _prompt: FsPrompt,
  ) {
    super();
  }

  public ngOnInit(): void {
    super.ngOnInit();
    
    if(this._addOptionInput) {
      forkJoin([
        this.fieldEditor.fieldCanEdit(this.field),
        this.fieldEditor.fieldCanConfig(this.field)
      ])
      .pipe(
        filter((response) => response[0] && response[1]),
      )
      .subscribe((value) => {
        this._addOptionInput.nativeElement.focus();
      });
    }
  }

  public addOption(e): void {
    if (e.key !== 'Enter' && e.key !== 'Tab') {
      return;
    }

    e.preventDefault();

    if (this.newOption.length) {

      this.field.config.configs.options.push({
        value: guid(),
        name: this.newOption,
      });

      this.newOption = '';
    }
    
    this.changed.emit(this.field);
  }

  public otherToggle(): void {
    this.field.config.configs.other = !this.field.config.configs.other;
    this.changed.emit(this.field);
  }

  public removeOption(index: number): void {
    this._prompt.confirm({
      title: 'Confirm',
      template: 'Are you sure you would like to remove this option?',
    }).subscribe(() => {
        this.field.config.configs.options.splice(index, 1);
        this.changed.emit(this.field);
    });
  }

  public drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.field.config.configs.options, event.previousIndex, event.currentIndex);
    this.changed.emit(this.field);
  }
}
