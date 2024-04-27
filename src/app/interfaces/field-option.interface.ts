import { Field } from './field.interface';

export interface FieldOption extends Field {
  options?: {
    name?: string;
    label?: string;
    notes?: boolean;
    notesLabel?: string;
    guid?: string;
    image?: any;
    value?: any;
  }[];
}
