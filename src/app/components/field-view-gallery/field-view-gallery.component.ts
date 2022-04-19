import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';

import { FsGalleryComponent, FsGalleryConfig, GalleryLayout, mime, ThumbnailScale } from '@firestitch/gallery';

import { of } from 'rxjs';


@Component({
  selector: 'fs-field-view-gallery',
  templateUrl: 'field-view-gallery.component.html',
  styleUrls: ['field-view-gallery.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldViewGalleryComponent implements OnInit {

  @ViewChild(FsGalleryComponent)
  public gallery: FsGalleryComponent;

  @Input() public field: any = { config: {} };
  @Input() public actions = [];

  public galleryConfig: FsGalleryConfig;

  public ngOnInit(): void {
    this._initGalleryConfig();
  }
  
  public reload(): void {
    this.gallery.reload();
  }

  private _initGalleryConfig(): void {
    let info: any = {
      icon: true,
    };

    if (this.actions.length) {
      info = {
        ...info,
        menu: {
          actions: this.actions,
        },
      };
    }

    this.galleryConfig = {
      map: (data) => {
        return {
          url: data.url,
          preview: data.url,
          name: data.name,
          mime: data.mime || mime(data.name, data.url)
        }
      },
      thumbnail: {
        width: 150,
        scale: ThumbnailScale.None,
      },
      showChangeSize: false,
      showChangeView: false,
      noResults: false,
      persist: false,
      layout: GalleryLayout.Flow,
      toolbar: false,
      zoom: false,
      info,
      fetch: () => {
        return of(this.field.data.value);
      },
    }
  }
}
