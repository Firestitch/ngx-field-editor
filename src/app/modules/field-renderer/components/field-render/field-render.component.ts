import {
  AfterContentInit, ChangeDetectionStrategy, Component, Input, Optional, QueryList,
} from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';

import { controlContainerFactory } from '@firestitch/core';

import { Observable, of, ReplaySubject } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';


import { FieldType } from '../../../../enums/field-type';
import { initField } from '../../../../helpers/init-field';
import { FieldRendererService } from '../../../../services';
import { FieldRenderDirective } from '../../directives/field-render/field-render.directive';

import { Field } from './../../../../interfaces';


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
})
export class FieldRenderComponent implements AfterContentInit {

  @Input()
  public fieldRenders = new QueryList<FieldRenderDirective>();

  public fieldRenderTemplateRefs = {};
  public field: Field = {};
  public fieldType = FieldType;

  private _disabledState = new ReplaySubject(1);
  private _disabled$ = this._disabledState
    .pipe(
      switchMap(() => {
        if (!!this.fieldRenderer?.config.disableField) {
          return this.fieldRenderer.config.disableField(this.field)
            .pipe(startWith(true));
        }

        return of(false);

      }),
    );

  constructor(
    @Optional() public fieldRenderer: FieldRendererService,
  ) { }

  @Input('field')
  public set setField(field) {
    this.field = initField(field);
    this._disabledState.next();
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
