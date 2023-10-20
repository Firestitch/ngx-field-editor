import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FsGalleryModule } from '@firestitch/gallery';

import { FieldGalleryComponent } from './components';


@NgModule({
  imports: [
    CommonModule,

    FsGalleryModule,
  ],
  exports: [
    FieldGalleryComponent,
  ],
  declarations: [
    FieldGalleryComponent,
  ],
})

export class FsFieldCommonModule {
}

