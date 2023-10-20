import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { FsDateModule } from '@firestitch/date';
import { FsGalleryModule } from '@firestitch/gallery';
import { FsHtmlRendererModule } from '@firestitch/html-editor';
import { FsLabelModule } from '@firestitch/label';

import { FsFieldCommonModule } from '../field-common/fs-field-common.module';

import { FieldViewGalleryComponent } from './components';
import { FieldViewHeadingComponent } from './components/field-view-heading/field-view-heading.component';
import { FieldViewOptionsComponent } from './components/field-view-options';
import { FieldViewComponent } from './components/field-view/field-view.component';
import { FieldViewerComponent } from './components/field-viewer/field-viewer.component';
import { FieldViewDirective } from './directives/field-view/field-view.directive';


@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,

    MatIconModule,
    MatTooltipModule,

    FsDateModule,
    FsHtmlRendererModule,
    FsLabelModule,
    FsGalleryModule,
    FsFieldCommonModule,
  ],
  exports: [
    FieldViewHeadingComponent,
    FieldViewerComponent,
    FieldViewComponent,
    FieldViewDirective,
  ],
  declarations: [
    FieldViewHeadingComponent,
    FieldViewerComponent,
    FieldViewComponent,
    FieldViewDirective,
    FieldViewOptionsComponent,
    FieldViewGalleryComponent,
  ],
})

export class FsFieldViewerModule {
}

