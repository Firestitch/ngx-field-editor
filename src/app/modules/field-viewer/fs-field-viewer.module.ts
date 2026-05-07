import { NgModule } from '@angular/core';

import { FieldViewComponent } from './components/field-view/field-view.component';
import { FieldViewerComponent } from './components/field-viewer/field-viewer.component';
import { FieldViewDirective } from './directives/field-view/field-view.directive';


@NgModule({
  imports: [
    FieldViewerComponent,
    FieldViewComponent,
    FieldViewDirective,
  ],
  exports: [
    FieldViewerComponent,
    FieldViewComponent,
    FieldViewDirective,
  ],
})
export class FsFieldViewerModule { }
