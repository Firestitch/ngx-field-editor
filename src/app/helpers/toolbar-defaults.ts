import { FieldType } from '../enums/field-type';

export const TOOLBAR_DEFAULTS = {
  [FieldType.ShortText]: { icon: 'short_text', label: 'Short Text'},
  [FieldType.LongText]: { icon: 'subject', label: 'Long Text' },
  [FieldType.Dropdown]: { icon: 'arrow_drop_down_circle', label: 'Dropdown' },
  [FieldType.Choice]: { icon: 'radio_button_checked', label: 'Choice' },
  [FieldType.Checkbox]: { icon: 'check_box', label: 'Checkboxes' },
  [FieldType.Date]: { icon: 'date_range', label: 'Date' },
  [FieldType.Time]: { icon: 'access_time', label: 'Time' },
  [FieldType.Name]: { icon: 'person', label: 'Name' },
  [FieldType.Phone]: { icon: 'phone', label: 'Phone' },
  [FieldType.Email]: { icon: 'email', label: 'Email' },
  [FieldType.File]: { icon: 'publish', label: 'File' },
  [FieldType.Gender]: { icon: 'wc', label: 'Gender' },
  [FieldType.Birthday]: { icon: 'cake', label: 'Birthday' },
  [FieldType.Address]: { icon: 'location_on', label: 'Address' },
  [FieldType.Heading]: { icon: 'title', label: 'Heading' },
  [FieldType.Content]: { icon: 'text_format', label: 'Content' },
  [FieldType.RichText]: { icon: 'art_track', label: 'RichText' },
};
