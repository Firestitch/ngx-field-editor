import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';

import { FsPrompt } from '@firestitch/prompt';
import { guid } from '@firestitch/common';

import { cloneDeep } from 'lodash-es';

import { FieldComponent } from '../../field/field.component';
import { FieldEditorService } from '../../../services/field-editor.service';


@Component({
  selector: 'fs-field-header',
  templateUrl: 'field-header.component.html',
  styleUrls: ['field-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldHeaderComponent extends FieldComponent implements OnInit {

  @ViewChild('description')
  public descriptionEl: ElementRef;

  public hasDescription;
  public canDelete = false;
  public canDuplicate = false;
  public canEdit = false;
  public canRequire = false;
  public canLabel = false;

  public constructor(
    public fieldEditor: FieldEditorService,
    private _prompt: FsPrompt,
    private _cdRef: ChangeDetectorRef,
  ) {
    super();
  }

  public ngOnInit(): void {
    this.hasDescription = !!this.field.config.description;

    this.fieldEditor.fieldCanDelete(this.field)
    .subscribe((value) => {
      this.canDelete = value;
      this._cdRef.markForCheck();
    });
    
    this.fieldEditor.fieldCanEdit(this.field)
    .subscribe((value) => {
      this.canEdit = value;
      this._cdRef.markForCheck();
    });
    
    this.fieldEditor.fieldCanDuplicate(this.field)
    .subscribe((value) => {
      this.canDuplicate = value;
      this._cdRef.markForCheck();
    });
    
    this.fieldEditor.fieldCanRequire(this.field)
    .subscribe((value) => {
      this.canRequire = value;
      this._cdRef.markForCheck();
    });
    
    this.fieldEditor.fieldCanLabel(this.field)
    .subscribe((value) => {
      this.canLabel = value;
      this._cdRef.markForCheck();
    });
  }

  public toggleRequired(): void {
    this.field.config.configs.required = !this.field.config.configs.required;
    this.changed.emit(this.field);
  }

  public toggleDescriptionNote(): void {
    this.hasDescription = !this.hasDescription;
    this.changed.emit(this.field);

    if (this.hasDescription) {
      setTimeout(() => {
        this.descriptionEl.nativeElement.focus();
      });
    }
  }

  public copy(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    const copiedField = cloneDeep(this.field);
    const idx = this.fieldEditor.config.fields.indexOf(this.field) + 1;

    copiedField.config.guid = guid();
    copiedField.data = {};
    this.fieldEditor.fieldDuplicate(copiedField);

    this.fieldEditor.config.fields.splice(idx, 0, copiedField);
    this.fieldEditor.selectField(copiedField);
    this.fieldEditor.fieldDuplicated(copiedField);
  }

  public delete(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.fieldEditor.inDeletionMode = true;

    this._prompt
      .confirm({
        title: 'Confirm',
        template: 'Are you sure you would like to remove this field?',
      })
      .subscribe({
        next: () => {
          this.fieldEditor.inDeletionMode = false;
          this.fieldEditor.config.fields.splice(this.fieldEditor.config.fields.indexOf(this.field), 1);
          this.fieldEditor.unselectField();
          this.fieldEditor.fieldRemoved({ field: this.field, event: event });
          this._cdRef.markForCheck();
        },
        error: () => {
          this.fieldEditor.inDeletionMode = false;
        },
      });
  }

}
