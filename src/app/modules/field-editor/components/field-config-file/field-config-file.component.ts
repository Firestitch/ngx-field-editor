import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';

import { MatLegacySelect as MatSelect } from '@angular/material/legacy-select';

import { FieldComponent } from '.././field/field.component';


@Component({
  selector: 'fs-field-config-file',
  templateUrl: './field-config-file.component.html',
  styleUrls: ['./field-config-file.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldConfigFileComponent extends FieldComponent implements OnInit {

  @ViewChild(MatSelect)
  public allowFileTypeSelect: MatSelect;

  public imageQuality;
  public allowFileTypes = [];

  public ngOnInit(): void {
    this.imageQuality = this.field.configs.imageQuality * 100;

    if(this.field.configs.allowedFileTypes.video) {
      this.allowFileTypes.push('video');
    }

    if(this.field.configs.allowedFileTypes.image) {
      this.allowFileTypes.push('image');
    }

    if(this.field.configs.allowedFileTypes.pdf) {
      this.allowFileTypes.push('pdf');
    }
  }

  public allowFileTypeChange(allowFiles): void {
    if(allowFiles.indexOf(null) !== -1) {
      this.allowFileTypes = [];
      this.allowFileTypeSelect.close();
    }

    this.field.configs.allowedFileTypes = {};

    if(this.allowFileImage) {
      this.field.configs.allowedFileTypes.image = true;
    }

    if(this.allowFileVideo) {
      this.field.configs.allowedFileTypes.video = true;
    }

    if(this.allowFilePdf) {
      this.field.configs.allowedFileTypes.pdf = true;
    }

    this.fieldSave();
  }

  public get allowFileImage(): boolean {
    return this.allowFileTypes.indexOf('image') !== -1;
  }

  public get allowFilePdf(): boolean {
    return this.allowFileTypes.indexOf('pdf') !== -1;
  }

  public get allowFileVideo(): boolean {
    return this.allowFileTypes.indexOf('video') !== -1;
  }

  public imageQualityChange(value): void {
    this.field.configs.imageQuality = value / 100;
    this.fieldSave();
  }

}
