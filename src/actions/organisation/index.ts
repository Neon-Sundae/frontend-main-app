/* eslint-disable import/prefer-default-export */
import { EDIT_ORGANISATION, HORIZONTAL_BAR_TAB_SELECTED } from './types';

export const editOrganisation = (isEditable: boolean) => ({
  type: EDIT_ORGANISATION,
  isEditable,
});

export const selectedOrganisationPageTab = (selectedTab: number) => ({
  type: HORIZONTAL_BAR_TAB_SELECTED,
  selectedTab,
});
