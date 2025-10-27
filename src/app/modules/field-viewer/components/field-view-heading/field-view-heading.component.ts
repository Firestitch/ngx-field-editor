import { ChangeDetectionStrategy, Component, Input } from '@angular/core';


@Component({
    selector: 'fs-field-view-heading',
    templateUrl: './field-view-heading.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
})
export class FieldViewHeadingComponent {

  @Input() public field;

}
