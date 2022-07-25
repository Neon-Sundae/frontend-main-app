import { Dispatch, SetStateAction } from 'react';
import { toast } from 'react-hot-toast';
import { UseMutationResult } from 'react-query';

interface IOnDragEnd {
  result: any;
  elements: any;
  setElements: Dispatch<SetStateAction<any>>;
  updateTask: UseMutationResult<Response, any, any, unknown>;
  projectData: any;
  userId: number | undefined;
}

const removeFromList = (list: string, index: number): [any, any] => {
  const result = Array.from(list);
  const [removed] = result.splice(index, 1);

  return [removed, result];
};

const addToList = (list: string, index: number, element: string) => {
  const result = Array.from(list);
  result.splice(index, 0, element);
  return result;
};

const isProjectFounder = (founderUserId: any, userId: number | undefined) => {
  if (userId && founderUserId === userId) return true;
  return false;
};

const sourceOpen = (result: any) => result.source.droppableId === 'open';

const sourceInProgress = (result: any) =>
  result.source.droppableId === 'in progress';

const sourceInReview = (result: any) =>
  result.source.droppableId === 'in review';

const sourceCompleted = (result: any) =>
  result.source.droppableId === 'completed';

const sourceCancelled = (result: any) =>
  result.source.droppableId === 'cancelled';

const destinationOpen = (result: any) =>
  result.destination.droppableId === 'open';

const destinationInterviewing = (result: any) =>
  result.destination.droppableId === 'interviewing';

const destinationInProgress = (result: any) =>
  result.destination.droppableId === 'in progress';

const destinationInReview = (result: any) =>
  result.destination.droppableId === 'in review';

const destinationCompletd = (result: any) =>
  result.destination.droppableId === 'completed';

const destinationCancelled = (result: any) =>
  result.destination.droppableId === 'cancelled';

const notAllowedCases = (
  result: any,
  founderUserId: any,
  userId: number | undefined
) => {
  console.log('test');
  if (!result.destination) {
    return false;
  }

  if (sourceCompleted(result)) {
    toast.error('Cannot move completed tasks');
    return false;
  }

  if (sourceCancelled(result)) {
    toast.error('Cannot move cancelled tasks');
    return false;
  }

  if (destinationCancelled(result)) {
    toast.error('Cannot move to cancelled');
    return false;
  }

  if (sourceOpen(result)) {
    toast.error('Accept a builder');
    return false;
  }

  if (
    (destinationOpen(result) || destinationInterviewing(result)) &&
    (sourceInProgress(result) || sourceInReview(result))
  ) {
    toast.error('Cannot move to open');
    return false;
  }

  if (
    isProjectFounder(founderUserId, userId) &&
    sourceInProgress(result) &&
    destinationInReview(result)
  ) {
    toast.error('Only Builder can perform this operation');
    return false;
  }

  if (!isProjectFounder(founderUserId, userId) && destinationCompletd(result)) {
    toast.error('Only Founder can perform this operation');
    return false;
  }

  return true;
};

const onDragEnd = async ({
  elements,
  result,
  setElements,
  updateTask,
  projectData,
  userId,
}: IOnDragEnd) => {
  if (
    notAllowedCases(
      result,
      projectData.organisation.organisationUser[0].userId,
      userId
    )
  ) {
    const listCopy = { ...elements };

    const sourceList = listCopy[result.source.droppableId];
    const [removedElement, newSourceList] = removeFromList(
      sourceList,
      result.source.index
    );
    listCopy[result.source.droppableId] = newSourceList;
    const destinationList = listCopy[result.destination.droppableId];
    listCopy[result.destination.droppableId] = addToList(
      destinationList,
      result.destination.index,
      removedElement
    );

    if (result.source.droppableId !== result.destination.droppableId) {
      setElements(listCopy);

      await updateTask.mutateAsync({
        taskId: removedElement.taskId,
        status: result.destination.droppableId,
      });
    }
  }
  // eslint-disable-next-line no-useless-return
  return;
};

export { onDragEnd, addToList, removeFromList, notAllowedCases };
