import { ChangeDetectionStrategy, Component, OnInit, Optional } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';

import { controlContainerFactory } from '@firestitch/core';

import { FieldComponent } from '../field/field.component';
import { FsLabelModule } from '@firestitch/label';
import { FsHtmlRendererModule } from '@firestitch/html-editor';


@Component({
    selector: 'fs-field-render-content',
    styleUrls: ['./field-render-content.component.scss'],
    templateUrl: './field-render-content.component.html',
    viewProviders: [
        {
            provide: ControlContainer,
            useFactory: controlContainerFactory,
            deps: [[new Optional(), NgForm]],
        },
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [FsLabelModule, FsHtmlRendererModule],
})
export class FieldRenderContentComponent extends FieldComponent {
}
