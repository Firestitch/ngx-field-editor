import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { FsPrompt } from '@firestitch/prompt';
import { guid } from '@firestitch/common';

import { cloneDeep } from 'lodash-es';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { FieldComponent } from '../field/field.component';
import { FieldEditorService } from '../../../services/field-editor.service';
import { SettingsComponent } from '../settings';
import { FieldType } from '../../../enums/field-type';


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
  public FieldType = FieldType;

  private _destroy$ = new Subject();
  
  public constructor(
    public fieldEditor: FieldEditorService,
    private _prompt: FsPrompt,
    private _dialog: MatDialog,
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

  public showValues(event: Event): void {
    this.field = {
      ...this.field,
      config: {
        ...this.field.config,
        configs: {
          ...this.field.config.configs,
          showValues: !this.field.config.configs.showValues,
        }
      },
    };
    
    this.changed.emit(this.field);
  }

  public settings(event: Event): void {
    this._dialog.open(SettingsComponent, {
      data: {
        field: this.field,
      },
    })
      .afterClosed()
      .pipe(
        filter((field) => !!field),
        takeUntil(this._destroy$),
      )
      .subscribe((field) => {
        this.field = field;
        this.changed.emit(this.field);
        this._cdRef.markForCheck();
      });
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

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }


}
