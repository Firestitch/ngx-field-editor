import { AfterContentInit, ChangeDetectionStrategy, Component, Input, Optional, QueryList, inject } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';

import { controlContainerFactory } from '@firestitch/core';

import { Observable, of, ReplaySubject } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';


import { FieldType } from '../../../../enums/field-type';
import { initField } from '../../../../helpers/init-field';
import { FieldRendererService } from '../../../../services';
import { FieldRenderDirective } from '../../directives/field-render/field-render.directive';

import { Field } from './../../../../interfaces';
import { NgClass, NgTemplateOutlet, AsyncPipe } from '@angular/common';
import { FieldRenderDateComponent } from '../field-render-date/field-render-date.component';
import { FieldRenderBirthdayComponent } from '../field-render-birthday/field-render-birthday.component';
import { FieldRenderTimeComponent } from '../field-render-time/field-render-time.component';
import { FieldRenderChoiceComponent } from '../field-render-choice/field-render-choice.component';
import { FieldRenderDropdownComponent } from '../field-render-dropdown/field-render-dropdown.component';
import { FieldRenderCheckboxComponent } from '../field-render-checkbox/field-render-checkbox.component';
import { FieldRenderNameComponent } from '../field-render-name/field-render-name.component';
import { FieldViewHeadingComponent } from '../../../field-viewer/components/field-view-heading/field-view-heading.component';
import { FieldRenderFileComponent } from '../field-render-file/field-render-file.component';
import { FieldRenderGenderComponent } from '../field-render-gender/field-render-gender.component';
import { FieldRenderAddressComponent } from '../field-render-address/field-render-address.component';
import { FieldRenderContentComponent } from '../field-render-content/field-render-content.component';
import { FieldRenderRichTextComponent } from '../field-render-rich-text/field-render-rich-text.component';
import { FieldRenderVisualSelectorComponent } from '../field-render-visual-selector/field-render-visual-selector.component';
import { FieldRenderTextComponent } from '../field-render-text/field-render-text.component';


@Component({
    selector: 'fs-field-render',
    styleUrls: ['./field-render.component.scss'],
    templateUrl: './field-render.component.html',
    viewProviders: [
        {
            provide: ControlContainer,
            useFactory: controlContainerFactory,
            deps: [[new Optional(), NgForm]],
        },
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        NgClass,
        NgTemplateOutlet,
        FieldRenderDateComponent,
        FieldRenderBirthdayComponent,
        FieldRenderTimeComponent,
        FieldRenderChoiceComponent,
        FieldRenderDropdownComponent,
        FieldRenderCheckboxComponent,
        FieldRenderNameComponent,
        FieldViewHeadingComponent,
        FieldRenderFileComponent,
        FieldRenderGenderComponent,
        FieldRenderAddressComponent,
        FieldRenderContentComponent,
        FieldRenderRichTextComponent,
        FieldRenderVisualSelectorComponent,
        FieldRenderTextComponent,
        AsyncPipe,
    ],
})
export class FieldRenderComponent implements AfterContentInit {
  fieldRenderer = inject(FieldRendererService, { optional: true });


  @Input()
  public fieldRenders = new QueryList<FieldRenderDirective>();

  public fieldRenderTemplateRefs = {};
  public field: Field = {};
  public fieldType = FieldType;

  private _disabledState = new ReplaySubject(1);
  private _disabled$ = this._disabledState
    .pipe(
      switchMap(() => {
        if (this.fieldRenderer?.config.disableField) {
          return this.fieldRenderer.config.disableField(this.field)
            .pipe(startWith(true));
        }

        return of(false);

      }),
    );

  @Input('field')
  public set setField(field) {
    this.field = initField(field);
    this._disabledState.next(false);
  }

  public get disabled$(): Observable<boolean> {
    return this._disabled$;
  }

  public get show$(): Observable<boolean> {
    if (this.fieldRenderer?.config?.showField) {
      return this.fieldRenderer.config.showField(this.field);
    }

    return of(true);
  }

  public ngAfterContentInit(): void {
    this.fieldRenders.forEach((directive: FieldRenderDirective) => {
      this.fieldRenderTemplateRefs[directive.type] = directive.templateRef;
    });
  }
}
