import {
  ChangeDetectionStrategy,
  Component,
  Input, OnChanges,
  OnInit, SimpleChanges,
  ViewChild,
} from '@angular/core';

import { FsApiFile } from '@firestitch/api';
import {
  FsGalleryComponent, FsGalleryConfig,
  FsGalleryItem,
  FsGalleryItemAction,
  mime,
} from '@firestitch/gallery';

import { Observable, of } from 'rxjs';

import { Field, FieldFile } from '../../../../interfaces';


@Component({
  selector: 'fs-field-gallery',
  templateUrl: './field-gallery.component.html',
  styleUrls: ['./field-gallery.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldGalleryComponent implements OnInit, OnChanges {

  @ViewChild(FsGalleryComponent)
  public gallery: FsGalleryComponent;

  @Input() public field: Field = { configs: {} };
  @Input() public actions: FsGalleryItemAction[] = [];
  @Input() public filePreviewDownload: (field: Field, file: FieldFile) => FsApiFile;
  @Input() public fileDownload: (field: Field, file: FieldFile) => FsApiFile;

  public galleryConfig: FsGalleryConfig;

  public ngOnInit(): void {
    this._initGalleryConfig();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.field?.currentValue !== changes.field?.previousValue
      || changes.actions?.currentValue !== changes.actions?.previousValue
    ) {
      this.reload();
    }
  }

  public reload(): void {
    this.gallery?.reload();
  }

  private _initGalleryConfig(): void {
    this.galleryConfig = {
      thumbnail: {
        width: 250,
        heightScale: .6,
      },
      showChangeSize: false,
      showChangeView: false,
      reload: false,
      noResults: false,
      persist: false,
      zoom: false,
      preview: false,
      info: {
        icon: false,
        name: true,
      },
      itemActions: this.actions,
      fetch: (): Observable<FsGalleryItem[]> => {
        const files = (this.field.data?.files || []) as any[];
      
        return of(
          files
            .map<FsGalleryItem>((file) => {
              const preview = file.url || 
                (this.filePreviewDownload && this.filePreviewDownload(this.field, file));

              const url = file.url || 
                (this.fileDownload && this.fileDownload(this.field, file));

              const galleryItem: FsGalleryItem = {
                url,
                preview,
                name: this.field.configs.showFilename === false ? '' : file.filename,
                mime: file.mime || mime(file.filename, file.url, '', false),
                data: file,
                guid: file.id,
              };

              return galleryItem;
            }),
        );
      },
    };
  }
}
