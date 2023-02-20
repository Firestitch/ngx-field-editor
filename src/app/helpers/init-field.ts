import { guid } from '@firestitch/common';
import { FieldType } from '../enums/field-type';
import { isObject } from 'lodash-es';
import { Field } from '../interfaces/field.interface';
import { parseLocal } from '@firestitch/date';
import { getPopulateFieldValue } from './get-populate-field-value';
import { VisualSelectorFormat } from '../enums';
import { FieldOption } from '../interfaces';


export function initField(field: Field | FieldOption): Field {
  if (!field) {
    field = {};
  }

  if (!field) {
    field = {};
  }

  if (!field.data) {
    field.data = {};
  }

  if (!field.configs) {
    field.configs = {};
  }

  switch (field.type) {
    case FieldType.Heading:
      field.hideDescription = true;
      field.hideRequired = true;
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
  
    break;

    case FieldType.Name:
      if (!field.configs.firstName) {
        field.configs.firstName = { display: true, label: 'First Name' };
      }

      if (!field.configs.lastName) {
        field.configs.lastName = { display: true, label: 'Last Name' };
      }
      break;

    case FieldType.File:
      if (field.configs.maxWidth === undefined ) {
        field.configs.maxWidth = 1024;
      }

      if (field.configs.maxHeight === undefined ) {
        field.configs.maxHeight = 768;
      }

      if (field.configs.imageQuality === undefined ) {
        field.configs.imageQuality = .8;
      }

      if (field.configs.allowedFileTypes === undefined ) {
        field.configs.allowedFileTypes = {
          image: true,
          video: true,
          pdf: true,
          other: true,
        };
      }

      if (field.configs.allowMultiple === undefined ) {
        field.configs.allowMultiple = true;
      }
      break;

    case FieldType.Address:
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

      break;
  
    case FieldType.Date:
    case FieldType.Time:
      field.data.value = field.data.value ? parseLocal(field.data.value) : null;

      if(field.data.value === null) {
        const value = getPopulateFieldValue(field);
        if(value !== null) {
          field.data.value = value;
        }
      }      

      break;
      
    case FieldType.RichText:
      if(!('value' in field.data)) {
        field.data.value = field.configs.default;
      }
    
      break;
  
    case FieldType.ShortText:
    case FieldType.LongText:
      field.data.value = field.data.value === null || field.data.value === undefined ?
        '' : 
        String(field.data.value);

      if(field.configs.populate) {
        const value = getPopulateFieldValue(field);
        if(value !== null) {
          field.data.value = value
        }
      }

      break;
    }

    if (!field.data.guid) {
      field.data.guid = guid();
    }

    if (field.type === FieldType.Heading && !field.configs.type) {
      field.configs.type = 1;
    }

    return field;
  }


  function initOption(field: FieldOption) {
    if(field.type === FieldType.Gender) {
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

    if (
      field.type === FieldType.Checkbox ||
      field.type === FieldType.Choice ||
      field.type === FieldType.Gender
    ) {
      const selected = field.type === FieldType.Checkbox ? [] : null;

      if (!isObject(field.data.value)) {
        field.data.value = { selected: selected };
      }

      const value = getPopulateFieldValue(field); 
      if(value !==null) {
        if(field.type === FieldType.Checkbox) {
          field.data.value.selected = value.split(',');
        } else {
          field.data.value.selected = value;
        }
      }
    } else if (field.type === FieldType.Dropdown) {
      if (isObject(field.data.value)) {
        field.data.value = null;
      }
    } else if (field.type === FieldType.VisualSelector) {
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

      if(!Array.isArray(field.data.value.selected)) {
        field.data.value.selected = [];
      }
    }
  }