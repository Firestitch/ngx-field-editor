import { guid, isObject, toString } from '@firestitch/common';
import { parseLocal } from '@firestitch/date';

import { VisualSelectorFormat } from '../enums';
import { FieldType } from '../enums/field-type';
import { FieldOption } from '../interfaces';
import { Field } from '../interfaces/field.interface';

import { getPopulateFieldValue } from './get-populate-field-value';


export function initField(field: Field | FieldOption): Field {
  if (!field) {
    field = {};
  }

  field.data = {
    ...field.data,
  };

  if (!field.data.guid) {
    field.data.guid = guid();
  }

  if (!field.configs) {
    field.configs = {};
  }

  switch (field.type as FieldType) {
    case FieldType.Heading:
      initHeading(field);
      break;

    case FieldType.Content:
      field.hideRequired = true;
      break;

    case FieldType.Checkbox:
    case FieldType.Choice:
    case FieldType.Dropdown:
    case FieldType.Gender:
      initOption(field);
      break;

    case FieldType.Name:
      initName(field);
      break;

    case FieldType.File:
      initFile(field);
      break;

    case FieldType.Address:
      initAddress(field);
      break;

    case FieldType.Date:
    case FieldType.Time:
      initDateTime(field);
      break;

    case FieldType.ShortText:
    case FieldType.LongText:
    case FieldType.RichText:
      initText(field);
      break;

    case FieldType.VisualSelector: {
      initOptionVisualSelector(field);
  
      break;
    }
  }

  return field;
}


function initOption(field: FieldOption) {
  const fieldType = field.type as FieldType;

  if (fieldType === FieldType.Gender) {
    if (!field.options) {
      field.options = [
        { name: 'Male', value: 'male', guid: guid() },
        { name: 'Female', value: 'female', guid: guid() },
      ];
    }
  } else if (!field.options) {
    field.options = [];
  }

  switch (fieldType) {
    case FieldType.Checkbox:
    case FieldType.Choice:
    case FieldType.Gender: {
      const selected = fieldType === FieldType.Checkbox ? [] : null;

      if (!isObject(field.data.value)) {
        field.data.value = { selected };
      }

      const value = getPopulateFieldValue(field);
      if (value !== null) {
        field.data.value.selected = fieldType === FieldType.Checkbox ? value.split(',') : value;
      }

      if (!isObject(field.data.value.notes)) {
        field.data.value.notes = {};
      }

      break;
    }
    case FieldType.Dropdown: {
      if (isObject(field.data.value)) {
        field.data.value = null;
      }

      break;
    }
  }

  initOptionDefault(field);
}

function initOptionDefault(field: FieldOption) {
  const _default = toString(field.configs.default).toLowerCase();
  if (_default.length) {
    const option = field.options
      .find((item) =>
        String(item.name).toLowerCase() === _default ||
        String(item.value).toLowerCase() === _default ||
        String(item.guid).toLowerCase() === _default);

    if (option) {
      switch (field.type as FieldType) {
        case FieldType.Choice:
          if (!field.data.value.selected) {
            field.data.value.selected = option.guid;
          }

          break;
        case FieldType.Dropdown:
          if (!field.data.value) {
            field.data.value = option.guid;
          }

          break;
      }
    }
  }
}

function initDateTime(field: Field) {
  field.data.value = field.data.value ? parseLocal(field.data.value) : null;

  if (field.data.value === null) {
    const value = getPopulateFieldValue(field);
    if (value !== null) {
      field.data.value = value;
    }
  }
}

function initHeading(field: Field) {
  field.hideDescription = true;
  field.hideRequired = true;
  if (field.type === FieldType.Heading && !field.configs.type) {
    field.configs.type = 1;
  }

  return field;
}

function initName(field: Field) {
  if (!field.configs.firstName) {
    field.configs.firstName = { display: true, label: 'First Name' };
  }

  if (!field.configs.lastName) {
    field.configs.lastName = { display: true, label: 'Last Name' };
  }

  if (!field.data.value || Array.isArray(field.data.value)) {
    field.data.value = {};
  }
}

function initOptionVisualSelector(field: FieldOption) {
  const configs = field.configs;
  if (!configs.previewWidth) {
    configs.previewWidth = 150;
  }

  if (!configs.previewHeight) {
    configs.previewHeight = 150;
  }

  if (!configs.format) {
    configs.format = VisualSelectorFormat.ImageName;
  }

  if (!isObject(field.data.value)) {
    field.data.value = {};
  }

  if (!Array.isArray(field.data.value.selected)) {
    field.data.value.selected = [];
  }
}

function initText(field: Field) {
  if (!('value' in field.data)) {
    field.data.value = field.configs.default;
  }

  field.data.value = field.data.value === null || field.data.value === undefined ?
    '' :
    String(field.data.value);

  if (field.configs.populate) {
    const value = getPopulateFieldValue(field);
    if (value !== null) {
      field.data.value = value;
    }
  }
}
function initFile(field: Field) {
  if (field.configs.maxWidth === undefined) {
    field.configs.maxWidth = 1024;
  }

  if (field.configs.maxHeight === undefined) {
    field.configs.maxHeight = 768;
  }

  if (field.configs.imageQuality === undefined) {
    field.configs.imageQuality = .8;
  }

  if (field.configs.allowedFileTypes === undefined) {
    field.configs.allowedFileTypes = {};
  }

  if (field.configs.allowMultiple === undefined) {
    field.configs.allowMultiple = true;
  }

  field.configs.showFilename = field.configs.showFilename ?? true;

  field.data.files = field.data.files || [];
}

function initAddress(field: Field) {
  field.hideRequired = true;
  if (!isObject(field.data.value)) {
    field.data.value = {};
  }

  if (!field.configs.street) {
    field.configs.street = { enabled: true, label: 'Street' };
  }

  if (!field.configs.address2) {
    field.configs.address2 = { enabled: false, label: 'Address 2' };
  }

  if (!field.configs.city) {
    field.configs.city = { enabled: true, label: 'City' };
  }

  if (!field.configs.region) {
    field.configs.region = { enabled: true, label: 'State/Province' };
  }

  if (!field.configs.zip) {
    field.configs.zip = { enabled: true, label: 'Zip/Postal Code' };
  }

  if (!field.configs.country) {
    field.configs.country = { enabled: true, label: 'Country' };
  }
}
