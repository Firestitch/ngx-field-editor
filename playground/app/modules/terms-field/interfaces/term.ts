import { TermType } from '../enums';

export interface Term {
  guid?: string,
  label?: string,
  type?: TermType,
  content?: string,
  contentUrl?: string,
  contentLabel?: string,
  contentTitle?: string
}