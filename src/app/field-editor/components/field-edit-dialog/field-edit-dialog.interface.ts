import { Field, FieldEditorConfig } from '../../../interfaces';
import { EditorAction } from '../../../enums';

export interface IEditDialogData {
  field: Field;
  config: FieldEditorConfig;
}

export interface IEditDialogAction {
  action: EditorAction;
  field: Field;
  data: any;
}
