import { ChangeDetectionStrategy, Component } from '@angular/core';

import { environment } from '../../../environments/environment';
import { FsExampleModule } from '@firestitch/example';
import { ExampleComponent } from '../example/example.component';
import { FieldRenderComponent } from '../field-render/field-render.component';

@Component({
    templateUrl: './examples.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        FsExampleModule,
        ExampleComponent,
        FieldRenderComponent,
    ],
})
export class ExamplesComponent {
  public config = environment;
}
