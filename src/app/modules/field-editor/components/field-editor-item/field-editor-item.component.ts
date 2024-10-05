import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
} from '@angular/core';

import { FsHtmlEditorConfig } from '@firestitch/html-editor';

import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { FieldType } from '../../../../enums';
import { Field } from '../../../../interfaces';
import { FieldEditorService } from '../../../../services';
import { FieldRenderDirective } from '../../../field-renderer/directives';
import { FieldConfigDirective } from '../../directives';


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
  public fieldContainerTemplateRef: TemplateRef<any>;

  @HostBinding('class.selected')
  public isFieldSelected = false;

  public FieldType = FieldType;
  public canEdit = false;
  public canConfig = false;
  public canReorder = false;
  public hasDescription = false;
  public froalaRenderEditorConfig: FsHtmlEditorConfig = null;

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

    this.froalaRenderEditorConfig = {
      autofocus: false,
      disabled: true,
      froalaConfig: this.field.configs.froalaConfig,
    };
  }

  public toggleDescriptionNote(field): void {
    this.hasDescription = !this.hasDescription;

    if (!this.hasDescription) {
      field.description = null;
    }

    this.fieldEditor.fieldChange(field);
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
    this._destroy$.next(null);
    this._destroy$.complete();
  }

}
