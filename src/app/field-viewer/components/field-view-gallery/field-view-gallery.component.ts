import {
  ChangeDetectionStrategy,
  Component,
  Input, OnChanges,
  OnInit, SimpleChanges,
  ViewChild,
} from '@angular/core';

import { FsGalleryComponent, FsGalleryConfig, FsGalleryItem, GalleryLayout, GalleryThumbnailSize, mime } from '@firestitch/gallery';
import { FsGalleryInfoConfig, FsGalleryItemAction } from '@firestitch/gallery/app/interfaces';

import { Observable, of } from 'rxjs';


@Component({
  selector: 'fs-field-view-gallery',
  templateUrl: './field-view-gallery.component.html',
  styleUrls: ['./field-view-gallery.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldViewGalleryComponent implements OnInit, OnChanges {

  @ViewChild(FsGalleryComponent, { static: true })
  public gallery: FsGalleryComponent;

  @Input() public field: any = { config: {} };
  @Input() public actions: FsGalleryItemAction[] = [];

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
    this.gallery.reload();
  }

  private _initGalleryConfig(): void {
    let info: FsGalleryInfoConfig = {
      icon: false,
    };

    if (this.actions.length) {
      info = {
        ...info,
        menu: {
          items: this.actions,
        },
      };
    }

    this.galleryConfig = {
      thumbnail: {
        width: 200,
        size: GalleryThumbnailSize.Contain,
        heightScale: !this.actions.length && this.field.configs.showFilename === false ? 1 : .6,
      },
      showChangeSize: false,
      showChangeView: false,
      noResults: false,
      persist: false,
      layout: GalleryLayout.Flow,
      zoom: false,
      preview: false,
      info,
      fetch: (query?: any, item?: FsGalleryItem): Observable<FsGalleryItem[]> => {
        const files = (this.field.data?.files || []) as any[];

        return of(
          files
            .map<FsGalleryItem>((file) => {
              const galleryItem: FsGalleryItem = {
                url: file.url,
                preview: file.url,
                name: this.field.configs.showFilename === false ? '' : file.filename,
                mime: file.mime || mime(file.filename, file.url, '', false),
                data: file,
              };

              return galleryItem;
            }),
        );
      },
    };
  }
}
