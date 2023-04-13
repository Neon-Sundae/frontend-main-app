/* eslint-disable import/prefer-default-export */
import {
  EDIT_ORGANISATION,
  HORIZONTAL_BAR_TAB_SELECTED,
  SET_PUBLIC_VIEW,
} from './types';

export const editOrganisation = (isEditable: boolean) => ({
  type: EDIT_ORGANISATION,
  isEditable,
});

export const selectedOrganisationPageTab = (selectedTab: number) => ({
  type: HORIZONTAL_BAR_TAB_SELECTED,
  selectedTab,
});

export const setOrgPublicView = (publicView: boolean) => ({
  type: SET_PUBLIC_VIEW,
  publicView,
});
