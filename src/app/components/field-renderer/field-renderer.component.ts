import { Component, OnInit, ContentChildren, QueryList, ChangeDetectionStrategy } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';

import { takeUntil } from 'rxjs/operators';

import { FieldCoreComponent } from '../field-core/field-core.component';
import { Field } from './../../interfaces/field.interface';
import { FieldRenderDirective } from './../../directives/field-render/field-render.directive';

@Component({
  selector: 'fs-field-renderer',
  templateUrl: 'field-renderer.component.html',
  styleUrls: [ 'field-renderer.component.scss' ],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldRendererComponent extends FieldCoreComponent implements OnInit {

  @ContentChildren(FieldRenderDirective)
  public fieldRenders: QueryList<FieldRenderDirective>;

  public ngOnInit(): void {
    this.fieldChanged
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe((item: Field) => {
        if (this.config.fieldChanged) {
          this.config.fieldChanged(this.fieldEditorService.output(item));
        }
      });
  }
}
