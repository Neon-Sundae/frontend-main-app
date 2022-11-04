/* eslint-disable import/prefer-default-export */
import { SET_PROJECT_TASK_ADDRESS, UPDATE_PROJECT_CATEGORY } from './types';

export const updateProjectCategory = (categories: any) => ({
  type: UPDATE_PROJECT_CATEGORY,
  categories,
});

export const setProjectTaskContract = (address: string) => ({
  type: SET_PROJECT_TASK_ADDRESS,
  address,
});
