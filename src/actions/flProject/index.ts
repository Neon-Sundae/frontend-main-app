/* eslint-disable import/prefer-default-export */
import { UPDATE_PROJECT_CATEGORY } from './types';

export const updateProjectCategory = (categories: any) => ({
  type: UPDATE_PROJECT_CATEGORY,
  categories,
});
