import {
  Component,
  Input,
  TemplateRef,
  HostBinding,
  ChangeDetectionStrategy,
  OnInit,
  ElementRef,
  ChangeDetectorRef,
  OnDestroy,
  ContentChild,
} from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

import { Field } from '../../../interfaces/field.interface';
import { FieldEditorService } from '../../../services/field-editor.service';
import { EditorAction, FieldType } from '../../../enums';
import { FieldConfigDirective, FieldContainerDirective } from '../../directives';
import { FieldRenderDirective } from '../../../field-renderer/directives';


@Component({
  selector: 'fs-field-editor-item',
  templateUrl: './field-editor-item.component.html',
  styleUrls: ['./field-editor-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldEditorItemComponent implements OnInit, OnDestroy {

  @ContentChild(FieldConfigDirective, { read: TemplateRef })
  public set contentFieldConfigTemplate(value: TemplateRef<any>) {
    if (value) {
      this.fieldConfigTemplate = value;
    }
  }

  @ContentChild(FieldRenderDirective, { read: TemplateRef })
  public set contentFieldRenderTemplate(value: TemplateRef<any>) {
    if (value) {
      this.fieldRenderTemplate = value;
    }
  }

  @Input()
  public field: Field;

  @Input()
  public fieldConfigTemplate: TemplateRef<any>;

  @Input()
  public fieldRenderTemplate: TemplateRef<any>;

  @Input()
  public fieldContainerTemplateRef: TemplateRef<FieldContainerDirective>;

  @HostBinding('class.selected')
  public isFieldSelected = false;

  public FieldType = FieldType;
  public canEdit = false;
  public canConfig = false;
  public canReorder = false;
  public hasDescription = false;

  private _destroy$ = new Subject();

  constructor(
    public fieldEditor: FieldEditorService,
    private _elRef: ElementRef,
    private _cdRef: ChangeDetectorRef,
  ) { }

  public fieldChange(field: Field) {
    this.fieldEditor.fieldChange(field);
    this.field = field;
  }

  public ngOnInit(): void {
    this.hasDescription = !!this.field.description;

    this.fieldEditor.fieldCanEdit(this.field)
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((value) => {
        this.canEdit = value;
        this._cdRef.markForCheck();
      });

    this.fieldEditor
      .fieldCanConfig(this.field)
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((value) => {
        this.canConfig = value;
        this._cdRef.markForCheck();
      });

    this.fieldEditor
      .fieldCanReorder(this.field)
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((value) => {
        this.canReorder = value;
        this._cdRef.markForCheck();
      });

    if (this.field === this.fieldEditor.scrollTargetField) {
      this.fieldEditor.resetScrollTarget();

      setTimeout(() => {
        this._elRef.nativeElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth',
        });
      }, 0);
    }

    this.fieldEditor.fieldSelected$
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((field) => {
        this.isFieldSelected = field?.guid === this.field.guid;
        this._cdRef.markForCheck();
      });

    this.fieldEditor.fieldUpdated$
      .pipe(
        filter((field) => field.guid === this.field.guid),
        takeUntil(this._destroy$),
      )
      .subscribe((field) => {
        this.field = field;
        this._cdRef.markForCheck();
      });

    this.fieldEditor.fieldChanged()
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((field: Field) => {
        if (field.guid === this.field.guid) {
          this.headerFieldChanged(field);
        }
      });
  }

  public toggleDescriptionNote(field): void {
    this.hasDescription = !this.hasDescription;

    if (!this.hasDescription) {
      field.description = null;
    }

    this.fieldEditor.action(EditorAction.FieldSave, field)
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => {
        this.fieldEditor.action(EditorAction.FieldSave, field);
      });
  }

  public dragStarted(): void {
    this.fieldEditor.unselectField();
  }

  public headerFieldChanged(field: Field): void {
    this.field = {
      ...field,
    };
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

}
