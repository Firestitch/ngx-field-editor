import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { FsPrompt } from '@firestitch/prompt';

import { cloneDeep } from 'lodash-es';
import { filter, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { FieldComponent } from '../field/field.component';
import { FieldEditorService } from '../../../services/field-editor.service';
import { SettingsComponent } from '../settings';
import { FieldAction, FieldType } from '../../../enums';
import { Field } from '../../../interfaces';


@Component({
  selector: 'fs-field-header',
  templateUrl: 'field-header.component.html',
  styleUrls: ['field-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldHeaderComponent
  extends FieldComponent
  implements OnInit, OnChanges, OnDestroy {

  @Input()
  public hasDescription = false;
  @ViewChild('description')
  public descriptionEl: ElementRef;

  public showDelete = false;
  public showDuplicate = false;
  public showSettings = false;
  public canEdit = false;
  public showRequired = false;
  public showDescription = false;
  public showLabel = false;
  public FieldType = FieldType;

  @Output()
  public fieldChanged = new EventEmitter<Field>();

  @Output()
  public toggleDescription = new EventEmitter<Field>();

  private _destroy$ = new Subject();

  public constructor(
    public fieldEditor: FieldEditorService,
    private _prompt: FsPrompt,
    private _dialog: MatDialog,
    private _cdRef: ChangeDetectorRef,
  ) {
    super(fieldEditor);
  }

  public changed(): void {
    this.fieldChanged.emit(this.field);
    this.fieldEditor.fieldChange(this.field);
  }

  public ngOnInit(): void {
    this.fieldEditor.fieldShowDelete(this.field)
    .pipe(
      takeUntil(this._destroy$),
    )
    .subscribe((value) => {
      this.showDelete = value;
      this._cdRef.markForCheck();
    });

    this.fieldEditor.fieldCanEdit(this.field)
    .pipe(
      takeUntil(this._destroy$),
    )
    .subscribe((value) => {
      this.canEdit = value;
      this._cdRef.markForCheck();
    });

    this.fieldEditor.fieldShowDuplicate(this.field)
    .pipe(
      takeUntil(this._destroy$),
    )
    .subscribe((value) => {
      this.showDuplicate = value;
      this._cdRef.markForCheck();
    });

    this.fieldEditor.fieldShowSettings(this.field)
    .pipe(
      takeUntil(this._destroy$),
    )
    .subscribe((value) => {
      this.showSettings = value;
      this._cdRef.markForCheck();
    });

    this.fieldEditor.fieldShowRequired(this.field)
    .pipe(
      takeUntil(this._destroy$),
    )
    .subscribe((value) => {
      this.showRequired = value;
      this._cdRef.markForCheck();
    });

    this.fieldEditor.fieldShowDescription(this.field)
    .pipe(
      takeUntil(this._destroy$),
    )
    .subscribe((value) => {
      this.showDescription = value;
      this._cdRef.markForCheck();
    });

    this.fieldEditor.fieldCanLabel(this.field)
    .pipe(
      takeUntil(this._destroy$),
    )
    .subscribe((value) => {
      this.showLabel = value;
      this._cdRef.markForCheck();
    });
  }

  public ngOnChanges(changes: any): void {
    if (changes.hasDescription?.currentValue) {
      setTimeout(() => {
        this.descriptionEl?.nativeElement?.focus();
      });
    }
  }

  public toggleRequired(): void {
    this.field.config.configs.required = !this.field.config.configs.required;
    this.fieldEditor.fieldAction(FieldAction.FieldSave, this.field)
    .pipe(takeUntil(this._destroy$))
    .subscribe(() => {
      this.changed();
    });
  }

  public toggleDescriptionNote(event: Event): void {
    event.stopPropagation();

    this.toggleDescription.emit(this.field);
  }

  public settings(event: Event): void {
    this._dialog.open(SettingsComponent, {
      data: {
        field: this.field,
        fieldEditor: this.fieldEditor,
      },
    })
      .afterClosed()
      .pipe(
        filter((field) => !!field),
        takeUntil(this._destroy$),
      )
      .subscribe((field) => {
        this.field = field;
        this._cdRef.markForCheck();
        this.changed();
      });
  }

  public fieldActionConfig(): void {
    this.fieldEditor.fieldAction(FieldAction.FieldSave, this.field)
      .subscribe(() => {
        this.changed();
      });
  }

  public duplicate(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    const index = this.fieldEditor.config.fields.indexOf(this.field) + 1;

    const copiedField = {
      ...cloneDeep(this.field),
      data: {},
    };

    this.fieldEditor.config.beforeFieldDuplicate(copiedField)
      .pipe(
        takeUntil(this._destory$),
        switchMap((field) => this.fieldEditor.fieldAction(FieldAction.FieldDuplicate, field, { index })),
        map((response) => response.field),
        switchMap((field) => this.fieldEditor.config.afterFieldDuplicated(field)),
        tap((field) =>  {
          this.fieldEditor.config.fields.splice(index, 0, field);
          this.fieldEditor.selectField(field);
        }),
      )
    .subscribe();
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
      .pipe(
        switchMap(() => this.fieldEditor.fieldAction(FieldAction.FieldDelete, this.field)),
        finalize(() => this.fieldEditor.inDeletionMode = false),
        takeUntil(this._destory$),
      )
      .subscribe(() => {
        this.fieldEditor.config.fields.splice(this.fieldEditor.config.fields.indexOf(this.field), 1);
        this.fieldEditor.unselectField();
        this._cdRef.markForCheck();
      });
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

}
