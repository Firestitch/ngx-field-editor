import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, ElementRef, HostBinding, Input, OnDestroy, OnInit, TemplateRef, inject } from '@angular/core';

import { FsHtmlEditorConfig, FsHtmlEditorModule } from '@firestitch/html-editor';

import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { FieldType } from '../../../../enums';
import { Field } from '../../../../interfaces';
import { FieldEditorService } from '../../../../services';
import { FieldRenderDirective } from '../../../field-renderer/directives';
import { FieldConfigDirective } from '../../directives';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FieldHeaderComponent } from '../field-header/field-header.component';
import { FieldConfigOptionsComponent } from '../field-config-options/field-config-options.component';
import { FieldConfigNameComponent } from '../field-config-name/field-config-name.component';
import { FieldConfigFileComponent } from '../field-config-file/field-config-file.component';
import { FieldConfigGenderComponent } from '../field-config-gender/field-config-gender.component';
import { FieldConfigHeadingComponent } from '../field-config-heading/field-config-heading.component';
import { FieldConfigContentComponent } from '../field-config-content/field-config-content.component';
import { FieldConfigRichTextComponent } from '../field-config-rich-text/field-config-rich-text.component';
import { FieldConfigAddressComponent } from '../field-config-address/field-config-address.component';
import { FieldConfigVisualSelectorComponent } from '../field-config-visual-selector/field-config-visual-selector.component';
import { FieldRenderTextComponent } from '../../../field-renderer/components/field-render-text/field-render-text.component';
import { FieldRenderChoiceComponent } from '../../../field-renderer/components/field-render-choice/field-render-choice.component';
import { FieldRenderDropdownComponent } from '../../../field-renderer/components/field-render-dropdown/field-render-dropdown.component';
import { FieldRenderCheckboxComponent } from '../../../field-renderer/components/field-render-checkbox/field-render-checkbox.component';
import { FieldRenderNameComponent } from '../../../field-renderer/components/field-render-name/field-render-name.component';
import { FieldRenderFileComponent } from '../../../field-renderer/components/field-render-file/field-render-file.component';
import { FieldRenderGenderComponent } from '../../../field-renderer/components/field-render-gender/field-render-gender.component';
import { FieldViewHeadingComponent } from '../../../field-viewer/components/field-view-heading/field-view-heading.component';
import { FieldRenderVisualSelectorComponent } from '../../../field-renderer/components/field-render-visual-selector/field-render-visual-selector.component';
import { FormsModule } from '@angular/forms';
import { FsFormModule } from '@firestitch/form';
import { FieldRenderAddressComponent } from '../../../field-renderer/components/field-render-address/field-render-address.component';


@Component({
    selector: 'fs-field-editor-item',
    templateUrl: './field-editor-item.component.html',
    styleUrls: ['./field-editor-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CdkDrag,
        NgClass,
        CdkDragHandle,
        MatIconButton,
        MatIcon,
        NgTemplateOutlet,
        FieldHeaderComponent,
        FieldConfigOptionsComponent,
        FieldConfigNameComponent,
        FieldConfigFileComponent,
        FieldConfigGenderComponent,
        FieldConfigHeadingComponent,
        FieldConfigContentComponent,
        FieldConfigRichTextComponent,
        FieldConfigAddressComponent,
        FieldConfigVisualSelectorComponent,
        FieldRenderTextComponent,
        FieldRenderChoiceComponent,
        FieldRenderDropdownComponent,
        FieldRenderCheckboxComponent,
        FieldRenderNameComponent,
        FieldRenderFileComponent,
        FieldRenderGenderComponent,
        FieldViewHeadingComponent,
        FieldRenderVisualSelectorComponent,
        FsHtmlEditorModule,
        FormsModule,
        FsFormModule,
        FieldRenderAddressComponent,
    ],
})
export class FieldEditorItemComponent implements OnInit, OnDestroy {
  fieldEditor = inject(FieldEditorService);
  private _elRef = inject(ElementRef);
  private _cdRef = inject(ChangeDetectorRef);


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
  public htmlEditorConfig: FsHtmlEditorConfig = null;

  private _destroy$ = new Subject();

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

    this.htmlEditorConfig = {
      autofocus: false,
      disabled: true,
      label: this.field.label,
      hint: this.field.description,
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
