import {
  Component,
  Input,
  TemplateRef,
  HostBinding,
  ChangeDetectionStrategy,
  OnInit,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';

import { Field } from '../../../interfaces/field.interface';
import { FieldType } from '../../../enums/field-type';
import { FieldEditorService } from '../../../services/field-editor.service';


@Component({
  selector: 'fs-field-editor-item',
  templateUrl: './field-editor-item.component.html',
  styleUrls: [
    './field-editor-item.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldEditorItemComponent implements OnInit {

  @Input() 
  public field: Field;

  @Input()
  public fieldConfigTemplateRefs: Record<string, TemplateRef<unknown>>;

  @Input()
  public fieldRenderTemplateRefs: Record<string, TemplateRef<unknown>>;

  public fieldType = FieldType;
  public canEdit = false;
  public canConfig = false;

  constructor(
    public fieldEditor: FieldEditorService,
    private _elRef: ElementRef,
    private _cdRef: ChangeDetectorRef,
  ) {
  }

  @HostBinding('class.selected')
  public get isSelectedField(): boolean {
    return this.fieldEditor.selectedField && (this.field.config.guid === this.fieldEditor.selectedField.config.guid);
  }

  public get fieldConfigTemplateRef(): TemplateRef<unknown> | false {
    return this.fieldConfigTemplateRefs && this.fieldConfigTemplateRefs[this.field.config.type];
  }

  public get fieldRenderTemplateRef(): TemplateRef<unknown> | false {
    return this.fieldRenderTemplateRefs && this.fieldRenderTemplateRefs[this.field.config.type];
  }

  public fieldChanged(field: Field) {
    this.fieldEditor.fieldChanged(field);
    this.field = field;
  }

  public ngOnInit(): void {
    this.fieldEditor.fieldCanEdit(this.field)
    .subscribe((value) => {
      this.canEdit = value;
      this._cdRef.markForCheck();
    });
    
    this.fieldEditor.fieldCanConfig(this.field)
    .subscribe((value) => {
      this.canConfig = value;
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
  }

}