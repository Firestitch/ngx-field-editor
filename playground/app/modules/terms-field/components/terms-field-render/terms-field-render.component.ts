import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input, OnDestroy, Optional, inject } from '@angular/core';
import { ControlContainer, ControlValueAccessor, NG_VALUE_ACCESSOR, NgForm, FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

import { MatCheckboxChange, MatCheckbox } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';

import { controlContainerFactory } from '@firestitch/core';
import { Field } from '@firestitch/field-editor';

import { Subject } from 'rxjs';

import { TermType } from '../../enums';
import { Term } from '../../interfaces';
import { TermsFieldRenderDialogComponent } from '../terms-field-render-dialog';
import { FsLabelModule } from '@firestitch/label';
import { FsFormModule } from '@firestitch/form';


@Component({
    selector: 'app-terms-field-render',
    templateUrl: './terms-field-render.component.html',
    styleUrls: ['./terms-field-render.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TermsFieldRenderComponent),
            multi: true,
        },
    ],
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
        FsLabelModule,
        MatCheckbox,
        FormsModule,
        FsFormModule,
    ],
})
export class TermsFieldRenderComponent implements ControlValueAccessor, OnDestroy {
  private _cdRef = inject(ChangeDetectorRef);
  private _dialog = inject(MatDialog);
  private _sanitizer = inject(DomSanitizer);


  @Input() public disabled;

  public TermType = TermType;
  public terms: Term[] = [];

  private _onChange: (value: unknown) => void;
  private _onTouch: (value: unknown) => void;

  private _field: Field = null;
  private _destroy$ = new Subject();

  public checkboxChange(event: MatCheckboxChange, termData): void {
    if (event.checked) {
      this.agree(termData);
    } else {
      this.disagree(termData);
    }
  }

  public agree(termData) {
    termData.date = new Date();
    // this.signature = null;
    // if (signature) {
    //   const base64 = `data:image/svg+xml;base64,${window.btoa(signature)}`;
    //   this.signature = this._sanitizer.bypassSecurityTrustUrl(base64);
    // }
  }

  public disagree(termData) {
    // this.signature = null;
    // this.field.data = {
    //   agreed: null,
    // }
  }

  public checkboxClick(event: UIEvent): void {
    // if (!this.disabled) {
    //   if (this.checked) {
    //     this.field.data.agree = {};
    //   } else if (this.field.configs.signature) {
    //     event.preventDefault();

    //     const dialogRef = this._dialog.open(SignatureDialogComponent, {
    //       data: { field: this._field },
    //     });

    //     dialogRef.afterClosed()
    //       .pipe(
    //         takeUntil(this._destroy$),
    //       )
    //       .subscribe((signature) => {
    //         if (signature) {
    //           this.checked = true;
    //           this.agree(signature);
    //           this._cdRef.markForCheck();
    //         }
    //       });
    //   }
    // }
  }

  public get field(): Field {
    return this._field;
  }

  public urlClick(event: UIEvent): void {
    event.stopPropagation();
  }

  public dialogClick(event: UIEvent, term: Term): void {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    this._dialog.open(TermsFieldRenderDialogComponent, {
      data: { term },
      minWidth: '500px',
    });
  }

  public writeValue(field: Field): void {
    if(field) {
      if (!field?.data) {
        field.data = {};
      }

      this.terms = field?.configs?.terms || [];  

      field.data.terms = field?.data?.terms || {};

      this.terms
        .forEach((term) => {
          if(!field.data.terms[term.guid]) {
            field.data.terms[term.guid] = {};
          }
        });   

      this._field = field;
      this._cdRef.markForCheck();
    }
  }

  public fieldChange(field: Field): void {
    this._field = field;
    this._onChange(field);
  }

  public registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this._onTouch = fn;
  }

  public ngOnDestroy(): void {
    this._destroy$.next(null);
    this._destroy$.complete();
  }

}
