/* eslint-disable import/prefer-default-export */
import { EDIT_ORGANISATION } from './types';

export const editOrganisation = (isEditable: boolean) => ({
  type: EDIT_ORGANISATION,
  isEditable,
});
