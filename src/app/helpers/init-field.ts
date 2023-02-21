import { guid } from '@firestitch/common';
import { parseLocal } from '@firestitch/date';

import { isObject } from 'lodash-es';

import { FieldType } from '../enums/field-type';
import { Field } from '../interfaces/field.interface';
import { VisualSelectorFormat } from '../enums';
import { FieldOption } from '../interfaces';

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

  switch (field.type) {
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
    case FieldType.VisualSelector:
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

    case FieldType.RichText:
      initRichText(field);
      break;

    case FieldType.ShortText:
    case FieldType.LongText:
      initText(field);
      break;
  }

  return field;
}


function initOption(field: FieldOption) {
  if (field.type === FieldType.Gender) {
    if (!field.options) {
      field.options = [
        { name: 'Male', value: 'male', guid: guid() },
        { name: 'Female', value: 'female', guid: guid() },
      ];
    }
  } else {
    if (!field.options) {
      field.options = [];
    }
  }

  switch (field.type) {
    case FieldType.Checkbox:
    case FieldType.Choice:
    case FieldType.Gender: {
      const selected = field.type === FieldType.Checkbox ? [] : null;

      if (!isObject(field.data.value)) {
        field.data.value = { selected };
      }

      const value = getPopulateFieldValue(field);
      if (value !== null) {
        field.data.value.selected = field.type === FieldType.Checkbox ? value.split(',') : value;
      }

      break;
    }
    case FieldType.Dropdown: {
      if (isObject(field.data.value)) {
        field.data.value = null;
      }

      break;
    }
    case FieldType.VisualSelector: {
      initOptionVisualSelector(field);

      break;
    }
    // No default
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

function initRichText(field: Field) {
  if (!('value' in field.data)) {
    field.data.value = field.configs.default;
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
    field.configs.allowedFileTypes = {
      image: true,
      video: true,
      pdf: true,
      other: true,
    };
  }

  if (field.configs.allowMultiple === undefined) {
    field.configs.allowMultiple = true;
  }

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
