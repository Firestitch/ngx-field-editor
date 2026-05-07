import { NgModule } from '@angular/core';

import { FieldRenderComponent } from './components/field-render/field-render.component';
import { FieldRendererComponent } from './components/field-renderer/field-renderer.component';
import { FieldRenderDirective } from './directives/field-render/field-render.directive';


@NgModule({
  imports: [
    FieldRendererComponent,
    FieldRenderComponent,
    FieldRenderDirective,
  ],
  exports: [
    FieldRendererComponent,
    FieldRenderComponent,
    FieldRenderDirective,
  ],
})
export class FsFieldRendererModule { }
