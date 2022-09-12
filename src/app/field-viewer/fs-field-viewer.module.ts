import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule } from '@angular/flex-layout';

import { FsLabelModule } from '@firestitch/label';
import { FsDateModule } from '@firestitch/date';
import { FsGalleryModule } from '@firestitch/gallery';
import { FsHtmlRendererModule } from '@firestitch/html-editor';

import { FieldViewerComponent } from './components/field-viewer/field-viewer.component';
import { FieldViewDirective } from './directives/field-view/field-view.directive';
import { FieldViewGalleryComponent } from './components/field-view-gallery/field-view-gallery.component';
import { FieldViewComponent } from './components/field-view/field-view.component';

import { FieldViewHeadingComponent } from './components/field-view-heading/field-view-heading.component';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,

    FsDateModule,
    FsHtmlRendererModule,
    FsLabelModule,
    FsGalleryModule,
  ],
  exports: [
    FieldViewHeadingComponent,
    FieldViewerComponent,
    FieldViewComponent,
    FieldViewDirective,
    FieldViewGalleryComponent,
  ],
  declarations: [
    FieldViewHeadingComponent,
    FieldViewerComponent,
    FieldViewComponent,
    FieldViewDirective,
    FieldViewGalleryComponent,
  ],
})

export class FsFieldViewerModule {
}

