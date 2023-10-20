import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';

import { FsGalleryMenuItem } from '@firestitch/gallery';

import { ViewerAction } from '../../../../enums';
import { Field } from '../../../../interfaces';
import { FieldViewerService } from '../../../../services';


@Component({
  selector: 'fs-field-view-gallery',
  templateUrl: './field-view-gallery.component.html',
  styleUrls: ['./field-view-gallery.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldViewGalleryComponent implements OnInit {

  @Input() public field: Field;

  public menuItems: FsGalleryMenuItem[];

  constructor(
    private _fieldViewerService: FieldViewerService,
    private _cdRef: ChangeDetectorRef,
  ) { }

  public fileDownload(): void {
    this._fieldViewerService.action(ViewerAction.FileDownload, this.field, {})
      .subscribe();
  }

  public ngOnInit(): void {
    this._fieldViewerService.canFileDownload(this.field)
      .subscribe((canFileDownload) => {
        this.menuItems = canFileDownload ? [
          {
            label: 'Download',
            click: () => {
              this.fileDownload();
            },
          },
        ] : [];

        this._cdRef.markForCheck();
      });
  }


}
