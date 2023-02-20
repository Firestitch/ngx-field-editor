import { Field } from '../interfaces/field.interface';

export function getPopulateFieldValue(field: Field): any {
    if(field.configs.populate) {
      const url = new URL(window.location.href);

      const value = url.searchParams.get(field.configs.identifier);

      if(value !== undefined) {
        return value;
      }
    }

    return null;
  }
