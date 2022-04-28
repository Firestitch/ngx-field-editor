import { guid } from '@firestitch/common';
import { FieldType } from '../enums/field-type';
import { isObject } from 'lodash-es';
import { Field } from '../interfaces/field.interface';


export function initField(field: Field): Field {
  if (!field) {
    field = {};
  }

  if (!field.data) {
    field.data = {};
  }

  if (!field.config) {
    field.config = {};
  }

  if (!field.config.configs) {
    field.config.configs = {};
  }

  switch (field.config.type) {
    case FieldType.Heading:
      field.config.hideDescription = true;
      field.config.hideRequired = true;
      break;

    case FieldType.Content:
      field.config.hideRequired = true;

      if(typeof field.data?.value !== 'string') {
        field.data = { value: field.config.configs?.content };
      }

      break;
    case FieldType.Paragraph:
      field.config.hideRequired = true;

      if(typeof field.data?.value !== 'string') {
        field.data = { value: field.config.configs?.content };
      }

      break;

    case FieldType.Checkbox:
    case FieldType.Choice:
    case FieldType.Dropdown:

      if (!field.config.configs.options) {
        field.config.configs.options = [];
      }

      if (field.config.type === FieldType.Checkbox ||
          field.config.type === FieldType.Choice) {

        const selected = field.config.type === FieldType.Checkbox ? [] : null;

        if (!isObject(field.data.value)) {
          field.data.value = { selected: selected };
        }
      }
      break;

    case FieldType.Name:
      if (!field.config.configs.firstName) {
        field.config.configs.firstName = { display: true, label: 'First Name' };
      }

      if (!field.config.configs.lastName) {
        field.config.configs.lastName = { display: true, label: 'Last Name' };
      }
      break;

    case FieldType.File:
      if (field.config.configs.maxWidth === undefined ) {
        field.config.configs.maxWidth = 1024;
      }

      if (field.config.configs.maxHeight === undefined ) {
        field.config.configs.maxHeight = 768;
      }

      if (field.config.configs.imageQuality === undefined ) {
        field.config.configs.imageQuality = .8;
      }

      if (field.config.configs.allowedFileTypes === undefined ) {
        field.config.configs.allowedFileTypes = {
          image: true,
          video: true,
          pdf: true,
          other: true,
        };
      }

      if (field.config.configs.allowMultiple === undefined ) {
        field.config.configs.allowMultiple = true;
      }
      break;

    case FieldType.Gender:
      if (!field.config.configs.genders) {
        field.config.configs.genders = [
          { name: 'Male', value: 'male' },
          { name: 'Female', value: 'female' },
          { name: 'Other', value: 'other' },
        ];
      }
      break;

    case FieldType.Address:
      field.config.hideRequired = true;
      if (!isObject(field.data.value)) {
        field.data.value = {};
      }

      if (!field.config.configs.street) {
        field.config.configs.street = { enabled: true, label: 'Street' };
      }

      if (!field.config.configs.address2) {
        field.config.configs.address2 = { enabled: false, label: 'Address 2' };
      }

      if (!field.config.configs.city) {
        field.config.configs.city = { enabled: true, label: 'City' };
      }

      if (!field.config.configs.region) {
        field.config.configs.region = { enabled: true, label: 'State/Province' };
      }

      if (!field.config.configs.zip) {
        field.config.configs.zip = { enabled: true, label: 'Zip/Postal Code' };
      }

      if (!field.config.configs.country) {
        field.config.configs.country = { enabled: true, label: 'Country' };
      }
      break;
    }

    if (!field.data.guid) {
      field.data.guid = guid();
    }

    if (field.config.type === FieldType.Heading && !field.config.configs.type) {
      field.config.configs.type = 1;
    }

    return field;
  }
